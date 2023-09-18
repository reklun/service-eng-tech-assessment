/**
 * for date time conversion and filling
 */

export const buildISODate = (dateInput: any): string => {
    if (dateInput != null && dateInput !== '') {
        return new Date(dateInput).toISOString();
    }

    return '';
}

export const buildCurrentDate = (): string => {
    return new Date().toISOString();
}

export const buildFirstDate = (): string => {
    return new Date(0).toISOString();
}

