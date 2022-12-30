import { stringifyQuery } from "vue-router";
import { Store } from "vuex";
import { JuteBagState } from "./types";

export type CONTENT_FORMAT = "JSON" | "PLAIN";

// FIXME: proper types!
// FIXME: "commit" is broken! => must be a method / function
export function createStoreClient(
  getters: any,
  commit: (mutation: string, data: any) => void
): {
  GET(path: string): Promise<Response>;
  POST(
    path: string,
    content: unknown,
    format: CONTENT_FORMAT
  ): Promise<Response>;
  PUT(
    path: string,
    content: unknown,
    format: CONTENT_FORMAT
  ): Promise<Response>;
} {
  async function refreshBearerToken(): Promise<string> {
    const refreshToken: string | undefined = getters["app/refreshToken"];
    if (!refreshToken) {
      throw new Error("No refresh token present!");
    }
    const options: RequestInit = {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain",
      },
      body: refreshToken,
    };
    const result = await fetch("api/login/refreshToken", options);
    if (result.status < 300) {
      const resultData = await result.json();
      console.log("retrieved result:", resultData);
      commit("app/setTokens", resultData);
      return resultData.bearerToken;
    }
    commit("app/logout", {});
    // result.refreshToken;

    // commit("app/setTokens", result);

    return Promise.reject();
  }

  async function runRequest(
    path: string,
    optionsProvider: (token: string) => RequestInit
  ): Promise<Response> {
    let bearerToken: string = getters["app/bearerToken"];
    console.log(
      "RUNNING REQUEST FOR PATH ",
      path,
      " with bearer ",
      bearerToken
    );
    if (!bearerToken) {
      bearerToken = await refreshBearerToken();
      console.log("Refreshing bearer token, new bearer token is ", bearerToken);
    }
    let result = await fetch("api" + path, optionsProvider(bearerToken));
    if (result.status < 300) {
      return result;
    } else if (result.status == 401) {
      bearerToken = await refreshBearerToken();
      result = await fetch("api" + path, optionsProvider(bearerToken));
      if (result.status < 300) {
        return result;
      }
      throw new Error("Unexpected response code " + result.status);
    } else {
      throw new Error("Unexpected response code " + result.status);
    }
  }

  async function PostOrPut(
    method: "POST" | "PUT",
    path: string,
    content: unknown,
    contentType: CONTENT_FORMAT
  ): Promise<Response> {
    const contentTypeHeader =
      contentType == "PLAIN" ? "text/plain" : "application/json";
    const requestBody: string =
      contentType == "PLAIN" ? (content as string) : JSON.stringify(content);
    const options = (bearer: string) =>
      ({
        method: method,
        cache: "no-cache",
        headers: {
          "Content-Type": contentTypeHeader,
          "X-Authorization": "Bearer " + bearer,
        },
        body: requestBody,
      } as RequestInit);

    return runRequest(path, options);
  }

  return {
    async GET(path: string): Promise<Response> {
      const options = (bearer: string) =>
        ({
          method: "GET",
          cache: "no-cache",
          headers: {
            "X-Authorization": "Bearer " + bearer,
          },
        } as RequestInit);

      return runRequest(path, options);
    },

    async PUT(
      path: string,
      content: unknown,
      contentType: CONTENT_FORMAT = "PLAIN"
    ): Promise<Response> {
      return PostOrPut("PUT", path, content, contentType);
    },

    async POST(
      path: string,
      content: unknown,
      contentType: CONTENT_FORMAT = "PLAIN"
    ): Promise<Response> {
      return PostOrPut("POST", path, content, contentType);
    },
  };
}

export function createClient(store: Store<JuteBagState>): {
  GET(path: string): Promise<Response>;
  POST(
    path: string,
    content: unknown,
    format: CONTENT_FORMAT
  ): Promise<Response>;
  PUT(
    path: string,
    content: unknown,
    format: CONTENT_FORMAT
  ): Promise<Response>;
} {
  return createStoreClient(store.getters, (mutation: string, data: any) =>
    store.commit(mutation, data, { root: true })
  );
  //   async function refreshBearerToken(): Promise<string> {
  //     const refreshToken: string | undefined = store.getters["app/refreshToken"];
  //     if (!refreshToken) {
  //       throw new Error("No refresh token present!");
  //     }
  //     const options: RequestInit = {
  //       method: "POST",
  //       cache: "no-cache",
  //       headers: {
  //         "Content-Type": "text/plain",
  //       },
  //       body: refreshToken,
  //     };
  //     const result = await fetch("api/login/refreshToken", options).then((res) =>
  //       res.json()
  //     );
  //     result.refreshToken;

  //     store.commit("app/setTokens", result);

  //     return result.bearerToken;
  //   }

  //   async function runRequest(
  //     path: string,
  //     optionsProvider: (token: string) => RequestInit
  //   ): Promise<Response> {
  //     let bearerToken: string = store.getters["app/bearerToken"];
  //     if (!bearerToken) {
  //       bearerToken = await refreshBearerToken();
  //     }
  //     let result = await fetch("api" + path, optionsProvider(bearerToken));
  //     if (result.status < 300) {
  //       return result;
  //     } else if (result.status == 401) {
  //       bearerToken = await refreshBearerToken();
  //       result = await fetch("api" + path, optionsProvider(bearerToken));
  //       if (result.status < 300) {
  //         return result;
  //       }
  //       throw new Error("Unexpected response code " + result.status);
  //     } else {
  //       throw new Error("Unexpected response code " + result.status);
  //     }
  //   }

  //   return {
  //     async GET(path: string): Promise<Response> {
  //       const options = (bearer: string) =>
  //         ({
  //           method: "GET",
  //           cache: "no-cache",
  //           headers: {
  //             Authorization: "Bearer " + bearer,
  //           },
  //         } as RequestInit);

  //       return runRequest(path, options);
  //     },

  //     async POST(
  //       path: string,
  //       content: unknown,
  //       contentType: CONTENT_FORMAT = "PLAIN"
  //     ): Promise<Response> {
  //       const contentTypeHeader =
  //         contentType == "PLAIN" ? "text/plain" : "application/json";
  //       const requestBody: string =
  //         contentType == "PLAIN" ? (content as string) : JSON.stringify(content);
  //       const options = (bearer: string) =>
  //         ({
  //           method: "POST",
  //           cache: "no-cache",
  //           headers: {
  //             "Content-Type": contentTypeHeader,
  //             Authorization: "Bearer " + bearer,
  //           },
  //           body: requestBody,
  //         } as RequestInit);

  //       return runRequest(path, options);
  //     },
  //   };
}
