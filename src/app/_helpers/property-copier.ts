export class PropertyCopier {
    static copyProperties<TParent extends Object, TChild extends Object>(parent: TParent, child: TChild): void {
        Object.keys(parent).forEach(key => {
            if (child.hasOwnProperty(key)) {
                (child as any)[key] = (parent as any)[key]
            }
        });
    }

    static clone<TParent extends Object, TChild extends Object>(parent: TParent, child: TChild): TChild {
        let result: TChild = {...child};
        Object.keys(parent).forEach(key => {
            if (result.hasOwnProperty(key)) {
                (result as any)[key] = (parent as any)[key]
            }
        });
        
        return result;
    }
}