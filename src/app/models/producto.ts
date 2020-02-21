import { Tipo } from './tipo';

export class Producto {
    id: number;
    nombre: string;
    descripcion: string;
    fechaEntrada: string;
    fechaCaducidad: string;
    tipo: Tipo;
}
