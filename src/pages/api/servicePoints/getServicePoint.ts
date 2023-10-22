import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import ServicePoint from '@/models/mongoSchemas/servicePointScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// - Ejemplo: /api/departments/getServicePoints?service_point_id=60f7b0b9e1b7b5a9b4a3b3a1

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { service_point_id } = req.query;

    const servicePoint = await ServicePoint.findOne({ _id: service_point_id });

    const department = await Department.findOne({
      _id: servicePoint.department,
    });

    if (servicePoint.available == false || department.available == false) {
      res.status(404).json({
        message: 'El punto de servicio no se encuentra disponible',
      });
    }

    res.status(200).json({
      message: 'Puntos de servicio obtenido correctamente',
      service_point_data: servicePoint,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
