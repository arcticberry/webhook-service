import { ValidationPipe as BaseValidationPipe, ArgumentMetadata, BadRequestException } from '@nestjs/common';

function formatNestedValidationError(error) {
    let errors = [];
    for (const child of error.children) {
        const obj = child['children'].map((c) => {

            return {
                field: `${error.property}.${child['property']}.${c.property}`,
                message: Object.values(c.constraints)[0],
            };
        });

        errors = errors.concat(obj);
    }

    return errors;
}

export default class ValidationPipe extends BaseValidationPipe {
    public async transform(value, metadata: ArgumentMetadata) {
        try {
            return await super.transform(value, metadata);
        } catch (e) {
            if (e instanceof BadRequestException) {

                const errors = (e.getResponse() as any).message.map((err) => {
                    if (err.constraints) {
                        return {
                            field: err.property,
                            message: Object.values(err.constraints)[0],
                        };
                    } else {

                        return formatNestedValidationError(err);
                    }
                });

                (e.getResponse() as any).message = 'Invalid Data';
                (e.getResponse() as any).errors = Array.isArray(errors[0]) ? errors[0] : errors;

                delete (e.getResponse() as any).error;

                throw new BadRequestException(e.getResponse());
            }
        }
    }
}