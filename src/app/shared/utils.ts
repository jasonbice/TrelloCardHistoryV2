export class Utils {
    
    static isNullOrWhiteSpace(val: string): boolean {
        return val === null || val.trim() === '';
    }

    static getDistinctObjectArray(array: any, distinctOnProperty: string) {
        return array.filter((obj, pos, arr) => {
            return arr.map(obj => obj[distinctOnProperty]).indexOf(obj[distinctOnProperty]) === pos;
        });
    }

    static getPointsRegExp(): RegExp {
        return new RegExp(/^\((\d+)\)/g);
    }

    static getSanitizedTitle(rawTitle: string): string {
        if (rawTitle == null) {
            return null;
        }

        const trimmedTitle = rawTitle.trim();
        const pointsRegEx: RegExpExecArray = Utils.getPointsRegExp().exec(trimmedTitle);

        if (pointsRegEx && pointsRegEx[0]) {
            return trimmedTitle.substring(pointsRegEx[0].length).trim();
        }

        return rawTitle;
    }

    static getSanitizedPoints(rawTitle: string): number {
        if (rawTitle == null) {
            return null;
        }

        const trimmedTitle = rawTitle.trim();
        const pointsRegEx: RegExpExecArray = Utils.getPointsRegExp().exec(trimmedTitle);

        if (pointsRegEx && pointsRegEx[1]) {
            return +pointsRegEx[1];
        }

        return null;
    }

    static getSanitizedDescription(description: string): string {
        if (description) {
            return description.replace(/\n/g, '<br />').replace(/[\r]/g, '<br />');
        }

        return description;
    }
}