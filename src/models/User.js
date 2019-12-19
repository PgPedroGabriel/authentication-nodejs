import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(connection) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        email_confirmation: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        email_confirmation_token: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.VIRTUAL
        },
        password_hash: {
          type: Sequelize.STRING
        }
      },
      {
        sequelize: connection
      }
    );
    this.addHook('beforeSave', async user => {
      if (!user.id) {
        // eslint-disable-next-line no-param-reassign
        user.email_confirmation_token = await bcrypt.hash(
          `CONFIRMATIONMAIL${user.email}`,
          1
        );
      }

      if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  async verifyPassword(password) {
    const verified = await bcrypt.compare(password, this.password_hash);
    return verified;
  }

  getConfirmationMailUrl(baseUrl) {
    return `${baseUrl}/user/auth/confirm-mail/${encodeURIComponent(
      this.email_confirmation_token
    )}`;
  }
}

export default User;
