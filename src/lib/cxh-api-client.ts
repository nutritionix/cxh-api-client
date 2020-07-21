import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const DEFAULT_BASEURL = 'https://api.syndigo.com';

export class CxhApiClient {
  private axios: AxiosInstance;
  private initialization: Promise<CxhApiClient> = null;

  constructor(
    private readonly username: string,
    private readonly secret: string,
    private readonly  baseUrl = DEFAULT_BASEURL) {}

  public async request(config: AxiosRequestConfig) {
    if (!this.initialization) {
      this.init();
    }

    await this.initialization;
    return (await this.axios(config)).data;
  }

  public init() {
    this.initialization = (async () => {
      const { data } = await axios.get(`${this.baseUrl}/api/auth?username=${this.username}&secret=${this.secret}`);

      this.axios = axios.create({
        baseURL: this.baseUrl,
        headers: {
          'Authorization': `EN ${data.Value}`,
          'Content-Type': 'application/json'
        }
      });

      return this;
    })();

    return this;
  }

  public async getGTIN(
    gtin: number | string,
    dataOwnerId: string,
    {
      targetPartyId = "47f66d9f-9429-48ad-8f2a-267dcd67a346",
    }: { targetPartyId?: string } = {}) {
    const response = await this.request({
      method: 'post',
      url: '/ui/product/',
      data: {
        "TargetPartyId": targetPartyId,
        "OrderBy": "LifeCycle.CreatedDate",
        "Desc": false,
        "AttributeFilterOperator": "And",
        "AttributeExistsFilters": [{ "AttributeId": "14116ff9-01e2-41b4-9e87-eb6028023e45", "Exists": false }],
        "AttributeFilters": [{
          "AttributeId": "6d030ff8-72ce-4f42-ba53-023f55c53a20",
          "Values": [gtin.toString()],
          "SearchType": "Contains"
        }],
        "OnHold": false,
        "Archived": false,
        "DateFilters": [{
          "Name": "DiscontinueDate",
          "Operator": "GreaterThan",
          "Value": (new Date()).toISOString(),
          "IncludeMissing": true
        }],
        "ProductSetId": null,
        "DataOwner": dataOwnerId,
      }
    });

    return response.Results[0];
  }
}
