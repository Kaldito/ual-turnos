import connectDB from '@/models/mongoConnection';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   department_id: 'ID del departamento',
//   name: 'Nombre del departamento',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { department_id, name } = req.body;

    // - Validando que no se haya registrado el mismo correo o contraseña
    const validateName = await ServicePoint.findOne({ name: name });

    if (validateName) {
      return res.status(400).json({
        message: 'El nombre del punto de servicio ya se encuentra registrado',
      });
    }

    const servicePoint = new ServicePoint({
      name: name,
      department: department_id,
    });

    await servicePoint.save();

    res.status(200).json({ message: 'Punto de servicio creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
