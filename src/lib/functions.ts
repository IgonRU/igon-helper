import {ActivatedRouteSnapshot} from '@angular/router';

export class FunctionsHelper {
  static debugMode = false;

  static b64DecodeUnicode(str: string) {
    const result = decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return result;
  }

  /**
   * Delete specified item of array. If `compare` is supplied,
   * compare items by this property (useful when items coming from different sources
   * so internally they may be different objects (ob1 === obj2 will result to false)
   * while we can determine that they are that same by e.g. id).
   *
   * @param array from which to delete the item
   * @param deleteItem item to source data from for search query for delete
   * @param compare property by which to compare items of array (e.g. id)
   * @returns array without `deleteItem`
   */
  static arrayDeleteItem<T>(array: T[], deleteItem: Partial<T>, compare: keyof typeof deleteItem = null): T[] {
    // if (_DEV) console.log('arrayDeleteItem: ', array, deleteItem, compare);
    const resultArray = array.filter(item => {
      let result = false;
      if (compare) {
        result = item[compare] != deleteItem[compare];
      } else {
        result = item != deleteItem;
      }
      return result;
    });

    return resultArray;
  }

  /**
   * Add item to array, if it isn't already there
   *
   * @param array array to which to add item
   * @param addItem item to add
   * @param compare property by which compare @see FunctionsHelper.arrayDeleteItem
   * @returns
   */
  static arrayAddItem<T>(array: T[], addItem: T, compare: keyof T = null): T[] {
    if (FunctionsHelper.arrayFindItem(array, addItem, compare).length === 0) {
      array.push(addItem);
    }

    return array;
  }

  /**
   * Find `findItem` item in array
   *
   * @param array array in which search should be performed
   * @param findItem item to source data from for search query
   * @param compare property by which to compare @see FunctionsHelper.arrayDeleteItem
   * @returns found items
   */
  static arrayFindItem<T>(array: T[], findItem: Partial<T>, compare: keyof typeof findItem = null): T[] {
    let result = [];
    if (array instanceof Array) {
      result = array.filter(item => {
        let found = false;
        if (compare) {
          if (compare) {
            found = item[compare] == findItem[compare];
          } else {
            found = item == findItem;
          }
        }

        return found;
      });

    }
    return result;
  }

  /**
   * If items is already in array, remove it from array.
   * If items isn't already in array, add it.
   *
   * @param array
   * @param item
   * @param compare @see FunctionsHelper.arrayDeleteItem
   * @returns
   */
  static arraySwitchItem<T>(array: T[], item: T, compare: keyof T = null) {
    if (FunctionsHelper.arrayFindItem(array, item, compare).length === 0) {
      array.push(item);
    } else {
      array = FunctionsHelper.arrayDeleteItem(array, item, compare);
    }

    return array;
  }

  /**
   * Follow `path` within `obj` and return resolved value
   *
   * @param path path to value in object (like accessing regular properties of certain object)
   * @param obj mapped object (object on which path is followed)
   * @param fallback what value to return, if path not found in `obj`
   * @returns resolved value
   */
  static parseTplGet(path: string, obj: {}, fallback = `$\{${path}}`) {
    const result = path.split('.').reduce((res, key) => res[key] || fallback, obj);
    return result;
  }
  /**
   * Extract `path`s from template string and replace them with resolved value
   *
   * @param template string, containing template paths
   * @param map mapped object (object on which path is followed, resolved)
   * @param fallback what value to return, if path not found in `obj`
   * @returns
   */
  static parseTpl(template: string, map: {}, fallback: string | null = null) {
    const result = template.replace(/\$\{.+?}/g, (match) => {
      const path = match.substr(2, match.length - 3).trim();
      return FunctionsHelper.parseTplGet(path, map, fallback);
    });

    return result;
  }
  /**
   * Parse url and replace templates (e.g. ${path.to.object.property})
   * with `path.to.object.property` property value
   *
   * @param template url, containing template paths
   * @param map object used to perform resolving
   * @param fallback value to be used in case of failed resolving
   * @param deleteTrailingSlash if url ends with `/` remove it
   * @returns url with resolved templates
   */
  static parseTplUrl(template: string, map: {}, fallback = '', deleteTrailingSlash = true) {
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
    const result = number + ' ' + after[index];
    return result;
  }

  static getSnapshotQueryParam(snapshot: ActivatedRouteSnapshot, paramName: string, defaultValue = null) {
    const result = paramName in snapshot.queryParams ? snapshot.queryParams[paramName] : defaultValue;
    return result;
  }

  static getSnapshotParam(snapshot: ActivatedRouteSnapshot, paramName: string, defaultValue = null) {
    const result = paramName in snapshot.params ? snapshot.params[paramName] : defaultValue;
    return result;
  }

  /**
   * Returns query string
   *
   * @deprecated use URLSearchParams
   * @param queryParams
   * @returns
   */
  static queryParamsToString<T, V = string | number | null | boolean>(queryParams: {[key: string]: Array<T> | V}) {
    if (this.debugMode) console.log('FunctionsHelper queryParamsToString queryParams: ', queryParams);
    let result = [];
    for (let key in queryParams) {
      if (!(queryParams[key] instanceof Array)) {
        result.push(`${key}=${queryParams[key]}`);
      } else {
        // @ts-ignore
        for (let item of queryParams[key]) {
          result.push(`${key}=${item}`);
        }
      }

    }
    return result.length ? result.join('&') : '';
  }
}
