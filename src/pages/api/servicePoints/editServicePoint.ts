import connectDB from '@/models/mongoConnection';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   service_point_id: 'ID del punto de servicio',
//   name: 'Nombre del punto de servicio',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { service_point_id, name } = req.body;

    // - Validando que no se haya registrado el mismo correo o contraseña
    const validateName = await ServicePoint.findOne({
      name: name,
      _id: { $ne: service_point_id },
    });

    if (validateName) {
      return res.status(400).json({
        message: 'El nombre del punto de servicio ya se encuentra registrado',
      });
    }

    await ServicePoint.updateOne({ _id: service_point_id }, { name: name });

    res
      .status(200)
      .json({ message: 'Punto de servicio editado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
