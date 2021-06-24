import { CreateOptions, Model } from 'sequelize'
import bcrypt from 'bcryptjs'

interface UserAttributes {
	email: string
	password: string
	roles: string
}

module.exports = (sequelize: any, DataTypes: any) => {
	class User extends Model<UserAttributes> implements UserAttributes {
		email!: string
		password!: string
		roles!: string

		static associate(models: any) {
		}

		async validPassword(password: string): Promise<boolean> {
			return await bcrypt.compare(password, this.password)
		}
	}

	User.init({
		email: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		roles: {
			type: DataTypes.STRING
		}
	}, {
		sequelize,
		modelName: 'User'
	})

	User.beforeCreate(async (user: User, options: CreateOptions<UserAttributes>) => {
		return await bcrypt.hash(user.password, 10)
			.then(hash => {
				user.password = hash
			})
			.catch(err => {
				throw new Error(err)
			})
	})

	return User
}
