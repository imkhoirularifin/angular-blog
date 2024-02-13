import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private routeCache = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true; // Always detach components for caching
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.routeCache.set(this.getPath(route), handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.routeCache.has(this.getPath(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.routeCache.get(this.getPath(route)) || null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path!;
    }
    return '';
  }
}
