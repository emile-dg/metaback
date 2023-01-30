import EErrorCode from "../errors/codes";

export default interface IAppError{
    code: EErrorCode,
    message?: string,
    isOperational: boolean,
}