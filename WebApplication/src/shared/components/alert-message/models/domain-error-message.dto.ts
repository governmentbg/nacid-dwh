import { DomainErrorAction } from "../enums/domain-error-action.enum";

export class DomainErrorMessageDto {
    errorCode: string;
    errorAction: DomainErrorAction;
    errorText: string;
    errorCount: number;
}