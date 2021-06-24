import { User } from './user'

interface SelectionCriteriaValidation {
	validateUser(user: User): boolean
}

export default SelectionCriteriaValidation