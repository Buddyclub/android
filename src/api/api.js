import {ApisauceInstance, create, ApiResponse} from 'apisauce';
import {getGeneralApiProblem} from './api-problem';
import {ApiConfig, DEFAULT_API_CONFIG} from './api-config';

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce;

  /**
   * Configurable options.
   */
  config;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Gets a list of repos.
   */
  async postData(data, route) {
    // make the api call
    const response = await this.apisauce.post(route, data, {});

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        return problem;
      }
    }

    // transform the data into the format we are expecting
    try {
      return {kind: 'ok', data: response?.data};
    } catch {
      return {kind: 'bad-data'};
    }
  }

  /**
   * Update data.
   */
  async putData(data, route) {
    // make the api call
    const response = await this.apisauce.put(route, data, {});

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        return problem;
      }
    }

    // transform the data into the format we are expecting
    try {
      return {kind: 'ok', data: response?.data};
    } catch {
      return {kind: 'bad-data'};
    }
  }
}
