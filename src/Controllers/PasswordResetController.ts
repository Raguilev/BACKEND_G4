import { Request, Response } from 'express';
import { User, Password_resets } from '../DAO/models';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const PasswordResetController = { User, Password_resets };

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    await Password_resets.create({
      user_id: user.id,
      token: token,
      created_at: new Date()
    });

    console.log(`Token de restablecimiento: ${token}`);
    res.status(200).json({ message: 'Se ha enviado un enlace de restablecimiento a tu correo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al solicitar el restablecimiento de contraseña' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const resetEntry = await Password_resets.findOne({ where: { token } });

    if (!resetEntry) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const now = new Date();
    const tokenExpiration = new Date(resetEntry.created_at.getTime() + 60 * 60 * 1000); // 1 hora
    if (now > tokenExpiration) {
      return res.status(400).json({ message: 'Token expirado' });
    }

    const user = await User.findByPk(resetEntry.user_id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    user.password_hash = newPasswordHash;
    await user.save();

    await Password_resets.destroy({ where: { id: resetEntry.id } });

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};

export default PasswordResetController