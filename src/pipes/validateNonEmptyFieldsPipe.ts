import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateNonEmptyFieldsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException(
        'El cuerpo de la solicitud no puede estar vacío.',
      );
    }

    const fieldsToValidate = ['name', 'email', 'address', 'phone'];

    fieldsToValidate.forEach((field) => {
      if (
        value.hasOwnProperty(field) &&
        (value[field] === '' || value[field].trim() === '')
      ) {
        throw new BadRequestException(
          `El campo ${field} no puede estar vacío.`,
        );
      }
    });
    const name = value.name;
    if (name && !/^[a-zA-Z\s]+$/.test(name)) {
      throw new BadRequestException(
        'El campo name solo puede contener letras y espacios',
      );
    }
    const address = value.address;
    if (address && !/^[a-zA-Z0-9\s]+$/.test(address)) {
      throw new BadRequestException(
        'El campo name solo puede contener letras y espacios',
      );
    }

    return value;
  }
}
