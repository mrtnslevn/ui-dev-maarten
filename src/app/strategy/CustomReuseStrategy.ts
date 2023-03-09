import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class CustomReuseStrategy implements BaseRouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
    store(route: ActivatedRouteSnapshot, handle: {}): void {

    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
    }
    retrieve(route: ActivatedRouteSnapshot): {} | null {
        return null;
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        let reuseComponent = future.data["reuseComponent"]
        let reuse = reuseComponent !== undefined ? reuseComponent : true
        return (future.routeConfig === curr.routeConfig) && reuse // default is true if configuration of current and future route are the same
    }
}