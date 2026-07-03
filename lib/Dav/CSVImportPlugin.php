<?php

namespace OCA\CustomGroups\Dav;

use Sabre\DAV;
use Sabre\HTTP\RequestInterface;
use Sabre\HTTP\ResponseInterface;

class CSVImportPlugin extends DAV\ServerPlugin {
	/**
	 * Reference to Server class.
	 *
	 * @var \Sabre\DAV\Server
	 */
	protected $server;

	public function initialize(DAV\Server $server) {
		$this->server = $server;
		$server->on('method:POST', [$this, 'httpPost'], 90);
	}

	public function httpPost(RequestInterface $request, ResponseInterface $response) {
		$path = $request->getPath();
		try {
			$node = $this->server->tree->getNodeForPath($path);
		} catch (DAV\Exception\NotFound $e) {
			// Kein Node unter diesem Pfad — nicht unser Endpoint. Die Exception
			// durchzulassen wuerde JEDEN fremden POST-Handler (z.B. den
			// Bulk-Upload-Endpoint unter /dav/bulk) mit einem 404 abwuergen,
			// bevor er ueberhaupt drankommt.
			return null;
		}
		if (!$node instanceof GroupMembershipCollection) {
			return null;
		}

		$result = [];

		$data = $request->getBodyAsString();
		$data = $this->csv_to_array($data);
		foreach ($data as $user => $role) {
			if ($node->childExists($user)) {
				$result[$user] = 'already-member';
				continue;
			}

			try {
				$node->createFile($user);
				$child = $node->getChild($user);
				if ($child->updateRole($role) !== true) {
					$result[$user] = "apply-role-failed";
				} else {
					$result[$user] = "success";
				}
			} catch (\Exception $ex) {
				$result[$user] = $ex->getMessage();
			}
		}

		// created
		$response->setStatus(201);
		$response->setHeader('Content-Type', 'application/json');
		$response->setBody(\json_encode($result));
		return false;
	}

	public function csv_to_array($data, $delimiter = ','): array {
		$stream = \fopen('php://memory', 'rb+');
		\fwrite($stream, $data);
		\rewind($stream);

		$header = null;
		$data = [];
		while (($row = \fgetcsv($stream, 1000, $delimiter)) !== false) {
			// Skip blank lines (fgetcsv yields [null]) and rows without both a
			// user and a role column — indexing $row[1] on a one-column row would
			// warn on PHP 8.4 and trim(null) is deprecated.
			if (!isset($row[0], $row[1])) {
				continue;
			}
			$user = \trim((string)$row[0]);
			if ($user === '') {
				continue;
			}
			$data[$user] = \trim((string)$row[1]);
		}
		\fclose($stream);

		return $data;
	}
}
