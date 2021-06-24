import { ReserveModel } from '../database/models/reserve'

class PendingReservesService {
	public static async getPendingReservesByDepartment() {
		const pendingReserves = await ReserveModel.aggregate([
			{
				$match: {
					'isProcessed': false
				}
			}, {
				$group: {
					'_id': {
						'departmentId': '$departmentId'
					},
					'reserves': {
						$addToSet: {
							'id': '$code'
						}
					}
				}
			}
		])
		if (pendingReserves.length == 0) {
			return `No hay reservas pendientes`
		}
		return pendingReserves
	}
}

export default PendingReservesService