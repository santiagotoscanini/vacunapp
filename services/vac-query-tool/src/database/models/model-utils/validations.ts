export default {
	minDepartmentId: [1, 'El valor para departamento minimo 1.'],
	maxDepartmentId: [19, 'El valor para departamento maximo 19.'],
	minDepartmentZone: [1, 'El valor para zona de departamento minimo 1.'],
	maxDepartmentZone: [99, 'El valor para zona de departamento maximo 99.'],
	workingTime: [[1, 2, 3], 'Valores permitidos [1, 2, 3]'],
	reserveStatusMessages: ['Reserva registrada con exito', 'Reserva procesada correctamente', 'Reserva procesada correctamente, se enviara un SMS con los detalles', 'Vacunación completada']
} as const
