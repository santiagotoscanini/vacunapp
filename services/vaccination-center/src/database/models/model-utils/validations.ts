export default {
	minAge: [18, 'Minimum Age supported is 18.'],
	maxAge: [106, 'Maximum Age supported is 106.'],
	fromDefaultAge: 18,
	toDefaultAge: 106,
	fromGreaterThanToErrorMessage: 'The Age from cannot be greater than age to.',
	minAmountOfVaccines: [0, 'Amount of vaccines cannot be less than 0.'],
	minDepartmentId: [1, 'Minimum Departament id supported is 1.'],
	maxDepartmentId: [19, 'Maximum Departament id supported is 19.'],
	minDepartmentZone: [1, 'Minimum Departament zone supported is 1.'],
	maxDepartmentZone: [99, 'Maximum Departament zone supported is 99.'],
	isCriteriaRequired: [true, 'Criteria is required.'],
	minPriorityGroup: [1, 'Minimum priority group is 1.'],
	maxPriorityGroup: [4, 'Maximum priority group is 4.'],
	isGroupRequired: [true, 'Priority group is required.'],
	workingTime: [[1, 2, 3], 'Must be one of [1, 2, 3]']
} as const
