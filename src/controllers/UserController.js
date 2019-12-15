import jwt from 'jsonwebtoken';
import User from '../models/User';

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
    const { id, username, email, name } = await User.create(req.body);

    return res.json({
      id,
      username,
      email,
      name
    });
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
