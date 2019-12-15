import User from '../models/User';

class SimpleAuthenticationController {
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

    await User.destroy({ where: { id } });

    return res.json();
  }
}

export default SimpleAuthenticationController;
