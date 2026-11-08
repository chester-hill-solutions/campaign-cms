export type CmsAdminAccessOptions = {
    /** Resolve from the host's secret binding; absent/empty credentials fail closed. */
    password: string | undefined;
    username?: string;
    /** Explicit opt-in: bypass credentials/HTTPS only on a loopback URL. */
    localDevelopment?: boolean;
};
/** Check every admin page, private server function and admin API before doing any work. */
export declare function checkCmsAdminAccess(request: Request, options: CmsAdminAccessOptions): Promise<Response | null>;
