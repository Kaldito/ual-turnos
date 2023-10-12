import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   department_id: 'ID del departamento',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { department_id } = req.body;

    await Department.updateOne({ _id: department_id }, { available: false });

    res.status(200).json({ message: 'Departamento desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
