import * as axios from 'axios';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from 'matris-logger';
import { getLogger } from '../../src/logger';

export class HttpClientError extends Error implements AxiosError {
    public name = 'HttpClientError';
    public config: AxiosRequestConfig;
    public code?: string;
    public request?: any;
    public response?: AxiosResponse;

    constructor(e: AxiosError) {
        super();
        this.config = e.config;
        this.code = e.code;
        this.request = e.request;
        this.response = e.response;
    }

}

export class HttpClient {

    private logger: Logger;

    constructor(public url: string) {
        this.logger = getLogger('HttpClient', ['test']);
    }

    public async request<T>(query: string, variables: { [key: string]: any }): Promise<AxiosResponse<T>> {
        try {
            this.logger.debug('Request', {query, variables});
            return await axios.default.request<T>({
                method: 'POST',
                url: this.url,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {query, variables}
            });
        } catch (e) {
            this.logger.http('Request', e.request, e.response, {data: e.response.data});
            throw new HttpClientError(e);
        }
    }
}
