/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ConfirmationMail from '../services/mail/ConfirmationMail';

class SimpleAuthenticationController {
  static async list(req, res) {
    const users = await User.findAndCountAll({
      attributes: ['name', 'username', 'email', 'createdAt', 'updatedAt', 'id']
    });

    return res.json(users);
  }

  static async auth(req, res) {
    const existUserName = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!existUserName) {
      return res.status(401).json();
    }

    const verified = await existUserName.verifyPassword(req.body.password);

    if (!verified) {
      return res.status(401).json();
    }

    if (!existUserName.email_confirmation) {
      return res.status(401).json({
        error: {
          message:
            'Você precisa confirmar o seu cadastro no e-mail que enviamos para sua caixa de entrada, isto está pendente para lhe conceder o acesso.',
          field: 'email'
        }
      });
    }

    const token = jwt.sign(
      {
        id: existUserName.id,
        username: existUserName.username,
        name: existUserName.name,
        email: existUserName.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION
      }
    );

    return res.json({
      token
    });
  }

  static async create(req, res) {
    const user = await User.create(req.body);
    const {
      id,
      username,
      email,
      name,
      email_confirmation_token,
      email_confirmation
    } = user;

    ConfirmationMail(
      email,
      user.getConfirmationMailUrl(`${req.protocol}://${req.get('host')}`)
    );

    return res.json({
      id,
      username,
      email,
      name,
      email_confirmation_token,
      email_confirmation
    });
  }

  static async confirmEmail(req, res) {
    // eslint-disable-next-line camelcase
    const { token } = req.params;

    const user = await User.findOne({
      where: { email_confirmation_token: token }
    });

    if (!user) {
      return res.status(404).send();
    }

    return res.status(200).send({ token: user.email_confirmation_token });
  }

  static async verifyEmail(req, res) {
    const { token } = req.params;

    const user = await User.findOne({
      where: { email_confirmation_token: token }
    });

    if (!user || user.email_confirmation) {
      return res.status(404).send();
    }

    if (user.email_confirmation) {
      return res.status(401).send('Email já confirmado.');
    }

    await User.update(
      {
        email_confirmation: true
      },
      {
        where: {
          id: user.id
        }
      }
    );

    return res.status(200).send('Email confirmado com sucesso');
  }

  static async read(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send();
    }

    const { name, email, username } = user;

    return res.json({
      id,
      name,
      email,
      username
    });
  }

  static async update(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send();
    }

    if (req.authUserInfo.id !== user.id) {
      return res.status(401).send();
    }

    await User.update(req.body, {
      where: { id }
    });

    const { name, email, username } = await User.findByPk(id);

    return res.json({
      id,
      name,
      email,
      username
    });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send();
    }

    if (req.authUserInfo.id !== user.id) {
      return res.status(401).send();
    }

    await User.destroy({ where: { id: user.id } });

    return res.json();
  }
}

export default SimpleAuthenticationController;
