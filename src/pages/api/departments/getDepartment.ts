import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// - department_id: ID del departamento

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { department_id } = req.query;

    const department = await Department.findOne({ _id: department_id });

    if (!department) {
      return res
        .status(400)
        .json({ message: 'No se ha econtrado el departamento...' });
    }

    res.status(200).json({
      message: 'Departamento obtenido correctamente',
      department_data: department,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
