import User from '../models/User';

class SimpleAuthenticationController {
  static async create(req, res) {
    const { username, email, name } = await User.create(req.body);

    return res.json({
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
      name,
      email,
      username
    });
  }
}

export default SimpleAuthenticationController;
