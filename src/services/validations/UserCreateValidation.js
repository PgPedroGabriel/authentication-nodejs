import * as Yup from 'yup';
import User from '../../models/User';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('O nome no cadastro de usuário é obrigatório'),
    email: Yup.string()
      .email('Email inválido')
      .required('O email é obrigatório'),
    username: Yup.string().required('Login do usuário obrigatório'),
    password: Yup.string()
      .required('Senha do usuário obrigatória')
      .min(8, 'Informe uma senha de no mínimo 8 caracteres'),
    passwordConfirm: Yup.string()
      .required('Confirmação de senha obrigatória')
      .oneOf(
        [Yup.ref('password'), null],
        'Confirmação de senha deve ser a mesma da senha original'
      )
  });

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

  if (existsUser) {
    error = {
      field: 'username',
      message: 'O nome de usuário já existe na base de dados, tente outro'
    };
    return res.status(400).json({ error });
  }

  return next();
};
