import {ActivatedRouteSnapshot} from '@angular/router';

export class FunctionsHelper {

  static b64DecodeUnicode(str) {
    const result = decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return result;
  }

  static arrayDeleteItem(array: any[], deleteItem: any, compare: string = null): any[] {
    const result = array.filter(item => {
      let result = false;
      if (compare) {
        result = item[compare] != deleteItem[compare];
      } else {
        result = item != deleteItem;
      }
      return result;
    });
    return result
  }

  static arrayAddItem(array: any[], addItem: any, compare: string = null): any[] {
    if (FunctionsHelper.arrayFindItem(array, addItem, compare).length === 0) {
      array.push(addItem);
    }

    return array;
  }

  static arrayFindItem(array: any[], findItem: any, compare: string = null): any[] {
    let result = [];
    if (array instanceof Array) {
      result = array.filter(item => {
        let found = false;
        if (compare) {
          found = item[compare] == findItem[compare];
        } else {
          found = item == findItem;
        }

        return found;
      });
    }
    return result;
  }

  static arraySwitchItem(array: any[], item: any, compare: string = null) {
    if (FunctionsHelper.arrayFindItem(array, item, compare).length === 0) {
      array.push(item);
    } else {
      array = FunctionsHelper.arrayDeleteItem(array, item, compare);
    }

    return array;
  }

  static parseTplGet(path, obj, fb = `$\{${path}}`) {
    const result = path.split('.').reduce((res, key) => res[key] || fb, obj);
    return result;
  }

  static parseTpl(template, map, fallback = null) {
    const result = template.replace(/\$\{.+?}/g, (match) => {
      const path = match.substr(2, match.length - 3).trim();
      return FunctionsHelper.parseTplGet(path, map, fallback);
    });
    return result;
  }

  static parseTplUrl(template, map, fallback = '', deleteTrailingSlash = true) {
    let result = FunctionsHelper.parseTpl(template, map, fallback);
    if (deleteTrailingSlash) {
      if (result.slice(-1) === '/') {
        result = result.slice(0, -1);
      }
    }
    return result;
  }

  static pluralForm(number: number, after: string[]) {
    const cases = [2, 0, 1, 1, 1, 2];
    const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)];
    return number + ' ' + after[index];
  }

  static getSnapshotQueryParam(snapshot: ActivatedRouteSnapshot, paramName: string, defaultValue = null) {
    return paramName in snapshot.queryParams ? snapshot.queryParams[paramName] : defaultValue;
  }

  static getSnapshotParam(snapshot: ActivatedRouteSnapshot, paramName: string, defaultValue = null) {
    return paramName in snapshot.params ? snapshot.params[paramName] : defaultValue;
  }

  static queryParamsToString(queryParams: {}) {
    let result = [];
    for (let key in queryParams) {
      if (!(queryParams[key] instanceof Array)) {
        result.push(`${key}=${queryParams[key]}`);
      } else {
        for (let item of queryParams[key]) {
          result.push(`${key}=${item}`);
        }
      }

    }
    return result.length ? result.join('&') : '';
  }

  static boolToInt(value: any) {
    let result = value;
    if (typeof value === 'boolean') {
      result = value ? 1 : 0;
    }

    return result;
  }

  static boolToIntArray(array: any[]) {
    const result = array.map(item => FunctionsHelper.boolToInt(item));
    return result;
  }

  static boolToIntObject(object: any) {
    let result = object;

    for (let key in object) {
      object[key] = FunctionsHelper.boolToInt(object[key]);
    }

    return result;
  }
}

