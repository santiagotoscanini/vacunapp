export default {
	minAge: [18, 'Edad minima soportada es 18.'],
	maxAge: [106, 'Edad maxima soportada es 106.'],
	fromDefaultAge: 18,
	toDefaultAge: 106,
	fromGreaterThanToErrorMessage: 'La edad de inicio no puede ser menor a la edad de fin.',
	minAmountOfVaccines: [0, 'Cantidad de vacunas no puede ser menor a 0.'],
	minDepartmentId: [1, 'El valor para departamento minimo 1.'],
	maxDepartmentId: [19, 'El valor para departamento maximo 19.'],
	minDepartmentZone: [1, 'El valor para zona de departamento minimo 1.'],
	maxDepartmentZone: [99, 'El valor para zona de departamento maximo 99.'],
	isCriteriaRequired: [true, 'El criterio es requerido.'],
	minPriorityGroup: [1, 'El valor para grupo minimo es 1.'],
	maxPriorityGroup: [4, 'El valor para grupo maximo es 4.'],
	isGroupRequired: [true, 'Grupo de prioridad es requerido.'],
	workingTime: [[1, 2, 3], 'Valores permitidos [1, 2, 3]']
} as const
