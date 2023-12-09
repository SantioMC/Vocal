import { availableCodes, connected } from '@service/minecraft';
import { Authorized, Get, JsonController } from 'routing-controllers';
import { clients, intermediateClients } from '~/socket/namespaces/client';
import { servers } from '~/socket/namespaces/server';

@JsonController('/metrics')
@Authorized()
export class MetricsController {
	@Get()
	getMetrics() {
		return {
			players: connected.length,
			servers: servers.length,
			clients: {
				total: clients.size + intermediateClients.size,
				waiting: intermediateClients.size,
				connected: clients.size
			},
			codes: {
				available: availableCodes.length
			}
		};
	}
}
