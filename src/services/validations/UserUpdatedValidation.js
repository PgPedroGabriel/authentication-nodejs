import * as Yup from 'yup';
import User from '../../models/User';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('O nome no cadastro de usuário é obrigatório'),
    email: Yup.string()
      .email('Email inválido')
      .required('O email é obrigatório'),
    username: Yup.string().required('Login do usuário obrigatório')
  });

  if (!req.params.id) {
    return res.status(400);
  }

  let error = null;

  const validate = await schema.validate(req.body).catch(e => {
    error = {
      message: e.message,
      field: e.path
    };
  });

  if (!validate) {
    return res.status(400).json({ error });
  }

  const existsUser = await User.findOne({
    where: { username: req.body.username }
  });

  if (existsUser && existsUser.id !== req.params.id) {
    error = {
      field: 'username',
      message: 'O nome de usuário já existe na base de dados, tente outro'
    };
    return res.status(400).json({ error });
  }

  return next();
};
