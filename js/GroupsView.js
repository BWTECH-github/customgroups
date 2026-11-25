/*
 * Copyright (c) 2016 Vincent Petry <pvince81@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function(OC, OCA) {

	/**
	 * @class OCA.CustomGroups.GroupsView
	 * @classdesc
	 *
	 */
	var GroupsView = OC.Backbone.View.extend(
		/** @lends OCA.CustomGroups.GroupsView.prototype */ {
		sync: OC.Backbone.davSync,

		_lastActive: null,

		_canCreate: true,

		events: {
			// Nur das Anlegeformular: "submit form" traf auch das Umbenennen-
			// Formular, und Enter beim Umbenennen legte dann eine Gruppe mit dem
			// Text an, der noch (nicht abgeschickt) im Anlegefeld stand.
			'submit form[name=customGroupsCreationForm]': '_onSubmitCreationForm',
			'submit form.group-rename-form': '_onSubmitRename',
			'keyup form.group-rename-form>input': '_onCancelRename',
			'blur form.group-rename-form>input': '_onBlurRename',
			'mousedown form.group-rename-form>label': '_onRenameLabelMouseDown',
			'click .select': '_onSelect',
			'click .action-rename-group': '_onRenameGroup',
			'click .action-delete-group': '_onDeleteGroup',
			'keydown a[role="button"]': '_onActionKeyDown'
		},

		initialize: function(collection, options) {
			this.collection = collection;
			options = _.extend({}, options);

			if (!_.isUndefined(options.canCreate)) {
				this._canCreate = !!options.canCreate;
			}

			this.collection.on('request', this._onRequest, this);
			this.collection.on('sync destroy error', this._onEndRequest, this);
			this.collection.on('add', this._onAddModel, this);
			this.collection.on('change', this._onChangeModel, this);
			this.collection.on('remove', this._onRemoveGroup, this);
		},

		_toggleLoading: function(state) {
			this._loading = state;
			this.$('.loading').toggleClass('hidden', !state);
		},

		_findGroupModelForEvent: function(ev) {
			var $el = $(ev.target).closest('.group');
			var id = $el.attr('data-id');
			return this.collection.findWhere({'id': id});
		},

		_onRenameGroup: function(ev) {
			var $groupEl = $(ev.target).closest('.group');
			var $displayName = $groupEl.find('.display-name-container');
			ev.preventDefault();

			var model = this._findGroupModelForEvent(ev); 
			if (!model) {
				return false;
			}

			var oldName = model.get('displayName');

			$groupEl.addClass('renaming');

			$displayName.addClass('hidden');
			$displayName.before(this.$renameForm);
			this.$renameForm.removeClass('hidden');
			this.$renameForm.find('input')
				.val(oldName)
				.focus()
				.selectRange(0, oldName.length)
				.attr('data-old-value', oldName);
			return false;
		},

		_submitRename: function() {
			var $groupEl = this.$renameForm.closest('.group');
			var model = this.collection.findWhere({id: $groupEl.attr('data-id')});
			var $displayName = $groupEl.find('.display-name-container');
			var newName = this.$renameForm.find('input').removeAttr('data-old-value').val();
			this.$renameForm.detach().addClass('hidden');

			$displayName.removeClass('hidden');
			$groupEl.removeClass('renaming');

			// Nach Enter oder Escape stand der Fokus auf <body>, der nächste Tab
			// begann am Seitenanfang. Er geht an den Namen der Zeile zurück; wer
			// das Feld mit Tab verlässt, behält sein neues Ziel.
			if (this._fokusNachUmbenennen) {
				this._fokusNachUmbenennen = false;
				$displayName.find('.group-display-name').focus();
			}

			if (!model) {
				return false;
			}

			// TODO: spinner
			var oldName = model.get('displayName');
			if (newName && newName !== oldName) {
				// set it temporarily, it will be re-rendered after finished saving
				$displayName.find('.group-display-name').text(newName);
				// TODO: lock row during save
				model.save({
					displayName: newName
				}, {
					wait: true,
					error: function(model, response) {
						$displayName.find('.group-display-name').text(oldName);

						// status 422 in case of validation error
						if (response.status === 422) {
							OC.Notification.showTemporary(t('customgroups', 'The group name can not be empty or start with space. The group name should at least have 2 characters or maximum 64 characters. Or kindly check if a group with this name already exists'));
							return;
						} else {
							OC.Notification.showTemporary(t('customgroups', 'Could not rename group'));
						}
					}
				});
			}
		},

		_onCancelRename: function(ev) {
			if (ev.type === 'keyup' && ev.keyCode !== 27) {
				// allow typing
				return;
			}

			if (ev.keyCode === 27) {
				ev.preventDefault();
				var $field = this.$renameForm.find('input');
				// restore old value
				this._fokusNachUmbenennen = true;
				$field.val($field.attr('data-old-value')).blur();
			}
		},

		_onSubmitRename: function(ev) {
			// usually triggered by enter key
			// Das Absenden unterband bisher nebenbei der Anlege-Handler; ohne ihn
			// würde das Formular die Seite neu laden.
			ev.preventDefault();
			this._fokusNachUmbenennen = true;
			this.$renameForm.find('input').blur();
			return false;
		},

		_onBlurRename: function() {
			this._submitRename();
		},

		/**
		 * Ein Klick auf die Beschriftung nahm dem Feld den Fokus, und das
		 * Verlassen des Feldes speichert und schließt das Umbenennen. Das Feld
		 * behält den Fokus.
		 */
		_onRenameLabelMouseDown: function(ev) {
			ev.preventDefault();
		},

		_onDeleteGroup: function(ev) {
			ev.preventDefault();

			var model = this._findGroupModelForEvent(ev); 
			if (!model) {
				return false;
			}

			OC.dialogs.confirm(
					t('customgroups', 'Are you sure that you want to delete the group "{groupName}" ?', {groupName: model.get('displayName')}, null, {escape: false}),
					t('customgroups', 'Confirm deletion of group'),
				function confirmCallback(confirmation) {
					if (confirmation) {
						model.destroy({
							wait: true
						});
					}
				},
				true
			);
			return false;
		},

		_onRequest: function() {
			this._toggleLoading(true);
			this.$('.empty').addClass('hidden');
		},

		_onEndRequest: function() {
			this._toggleLoading(false);
			this._updateEmptyState();
		},

		_updateEmptyState: function() {
			this.$('.empty').toggleClass('hidden', !!this.collection.length);
			this.$('.grid').toggleClass('hidden', !this.collection.length);
		},

		/**
		 * Select by group id or model.
		 *
		 * @param {String|OCA.CustomGroups.GroupModel} group group id or group model
		 * @param {Object} [$el] optional DOM element of the entry
		 */
		select: function(group, $el) {
			var model = group;
			if (_.isString(model)) {
				model = this.collection.findWhere({'id': model});
			}

			if (this._selected === model) {
				return;
			}

			if (this._lastActive) {
				this._lastActive.removeClass('active');
			}

			if (model) {
				this._selected = model;

				if (_.isUndefined($el)) {
					$el = this.$('.group').filterAttr('data-id', model.id);
				}
				this._lastActive = $el.addClass('active');
				this.trigger('select', model);
			} else {
				this._selected = null;
				this.trigger('select', null);
			}
		},

		/**
		 * Löst einen als Schaltfläche ausgezeichneten Anker mit der Leertaste
		 * aus. Browser tun das nur bei echten Buttons von selbst, Anker
		 * reagieren nur auf Enter.
		 */
		_onActionKeyDown: function(ev) {
			// 32 = Leertaste
			if (ev.keyCode !== 32) {
				return;
			}
			ev.preventDefault();
			// Eine gedrückt gehaltene Taste wiederholt sich. Ohne diese Sperre
			// öffnen sich mehrere Bestätigungsdialoge übereinander. Nicht nur
			// zurückkehren: Der Leertasten-Handler des Kerns für Anker klickte
			// die Wiederholungen sonst selbst.
			if (ev.originalEvent && ev.originalEvent.repeat) {
				return false;
			}
			$(ev.currentTarget).trigger('click');
			// false verhindert, dass die Zeile darunter zusätzlich reagiert
			return false;
		},

		_onSelect: function(ev) {
			ev.preventDefault();
			var $el = $(ev.target).closest('.group');
			var id = $el.attr('data-id');
			if ($el.hasClass('renaming')) {
				// don't select while renaming
				return;
			}
			this.select(id, $el);
		},

		/**
		 * Attempt creating a group with the given name.
		 * If the uri already exists, try another one.
		 *
		 * @param {string} groupName group display name
		 */
		_createGroup: function(groupName, index) {
			var self = this;
			// TODO: check if the current user already has a group with this name

			// it might happen that a group uri already exists for that name,
			// so attempt multiple ones
			this.collection.create({
				id: this._formatUri(groupName, index),
				displayName: groupName,
				role: OCA.CustomGroups.ROLE_ADMIN
			}, {
				wait: true,
				success: function(model) {
					self.$('[name=groupName]').val('');
					self.select(model);
				},
				error: function(model, response) {
					// stop at 100 to avoid running for too long...

					// status 405 in case uri/collection already exists
					if (response.status === 405 && (_.isUndefined(index) || index < 100)) {
						if (_.isUndefined(index)) {
							// attempt again with index
							index = 1;
						}
						self._createGroup(groupName, index + 1);
						return;
					}
					// status 409 if display name already exists
					if (response.status === 409) {
						OC.Notification.showTemporary(t('customgroups', 'A group with this name already exists'));
						return;
					}
					if (response.status === 422) {
						OC.Notification.showTemporary(t('customgroups', "The group name can not be empty or start with space. The group name should at least have 2 characters or maximum 64 characters"));
					}
					if (response.status === 403) {
						OC.Notification.showTemporary(t('customgroups', 'Could not create group'));
					}
				}
			});
		},

		_onSubmitCreationForm: function(ev) {
			ev.preventDefault();
			var groupName = this.$('[name=groupName]').val();

			if (groupName) {
				this._createGroup(groupName);
			}
			return false;
		},

		_onAddModel: function(model, collection, options) {
			var $el = $(this.itemTemplate(this._formatItem(model)));
			if (!_.isUndefined(options.at) && collection.length > 1) {
				this.$container.find('.group').eq(options.at).before($el);
			} else {
				this.$container.append($el);
			}
			this._postProcessRow($el, model);
			this._updateEmptyState();
		},

		_onChangeModel: function(model) {
			var $el = $(this.itemTemplate(this._formatItem(model)));
			var index = this.collection.indexOf(model);
			var $alt = this.$container.children().eq(index);
			// Lag der Fokus in der alten Zeile (Name nach dem Umbenennen), ginge
			// er mit ihr verloren; er wandert auf den Namen der neuen Zeile.
			var fokusInZeile = $alt.length && $.contains($alt.get(0), document.activeElement);
			$alt.replaceWith($el);
			this._postProcessRow($el, model);
			if (fokusInZeile) {
				$el.find('.group-display-name').focus();
			}
		},


		_postProcessRow: function($el, model) {
			$el.find('[title]').tooltip();
			/* jshint camelcase:false */
			if (OC.config.enable_avatars) {
				// no group avatars, so using "imageplaceholder" directly instead of "avatar"
				$el.find('.avatar').imageplaceholder(
					// combine uri with display name for seed
					model.id + ':' + model.get('displayName'),
					model.get('displayName'),
					32
				);
			}
		},

		_onRemoveGroup: function(model, collection, options) {
			var $groupEl;
			if (_.isNumber(options.index)) {
				$groupEl = this.$('.group-list .group:nth-child(' + (options.index + 1) + ')');
			} else {
				// less efficient
				$groupEl = this.$('.group-list .group').filterAttr('data-id', model.id);
			}
			if ($groupEl.hasClass('active')) {
				// deselect
				this.trigger('select', null);
				this._lastActive = null;
			}
			// Nach dem Löschen oder Verlassen stand der Fokus sonst auf <body>
			// (Knopf und Leiste sind weg): er geht an den nächsten Gruppennamen,
			// sonst an den vorigen, sonst an das Anlegefeld.
			var aktiv = document.activeElement;
			var $ziel = $();
			if (!aktiv || aktiv === document.body || ($groupEl.length && $.contains($groupEl.get(0), aktiv))) {
				$ziel = $groupEl.next('.group').find('.group-display-name');
				if (!$ziel.length) {
					$ziel = $groupEl.prev('.group').find('.group-display-name');
				}
				if (!$ziel.length) {
					$ziel = this.$('[name=groupName]');
				}
			}
			$groupEl.remove();
			if (!collection.length) {
				this._updateEmptyState();
			}
			$ziel.focus();
		},

		/**
		 * Converts a group display name to a valid URI name
		 *
		 * @param {string} groupName display name
		 * @return {string} group URI
		 */
		_formatUri: function(groupName, index) {
			// TODO: strip unwanted chars
			if (!_.isUndefined(index)) {
				return groupName + index;
			}
			return groupName;
		},

		_formatRoleLabel: function(role) {
			if (OC.isUserAdmin()) {
				return t('customgroups', 'Administrator');
			}
			if (role === OCA.CustomGroups.ROLE_ADMIN) {
				return t('customgroups', 'Group owner');
			} else if (role === OCA.CustomGroups.ROLE_MEMBER) {
				return t('customgroups', 'Member');
			}
			return '';
		},

		_formatItem: function(group) {
			return {
				id: group.id,
				displayName: group.get('displayName'),
				renameLabel: t('customgroups', 'Rename'),
				deleteLabel: t('customgroups', 'Delete'),
				canAdmin: OC.isUserAdmin() || group.get('role') === OCA.CustomGroups.ROLE_ADMIN,
				roleDisplayName: this._formatRoleLabel(group.get('role'))
			};
		},

		template: function(data) {
			return OCA.CustomGroups.Templates.list(data);
		},

		itemTemplate: function(data) {
			return OCA.CustomGroups.Templates.listItem(data);
		},

		render: function() {
			this.$el.html(this.template({
				displayNameLabel: t('customgroups', 'Display name'),
				groupNameLabel: t('customgroups', 'Group name'),
				newGroupSubmitLabel: t('customgroups', 'Create group'),
				groupLabel: t('customgroups', 'Group'),
				yourRoleLabel: t('customgroups', 'Your role'),
				emptyMessage: t('customgroups', 'There are currently no user defined groups'),
				canCreate: this._canCreate
			}));
			this.$container = this.$('.group-list');
			this.$renameForm = this.$('.group-rename-form').detach();
			this.delegateEvents();
		}
	});

	OCA.CustomGroups = _.extend({}, OCA.CustomGroups);
	OCA.CustomGroups.GroupsView = GroupsView;

})(OC, OCA);

