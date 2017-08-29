export class SfkFilters {

    private classes: { [name: string]: any } = {};


    public IsAllowedScripting(decorators: any[]): boolean {
        if (decorators && decorators.length > 0) {
            for (let decorator of decorators) {
                if (decorator.name === "Scripting") {
                    return true;
                }
            }
        }
        return false;
    }

    public filterComponentContent(deps: Deps) {
        let filteredProperties: object[] = [];
        let filteredMethods: object[] = [];
        let filteredOutputs: object[] = [];
        //Set Inputs as properties

        if (deps.extends) {
            let parentProperties = this.getRecursive(deps.extends, "properties");
            deps.propertiesClass = this.inheritParents(deps.propertiesClass, parentProperties);

            let parentMethods = this.getRecursive(deps.extends, "methods");
            deps.methodsClass = this.inheritParents(deps.methodsClass, parentMethods);
        }

        deps.propertiesClass = deps.propertiesClass.concat(deps.inputsClass);
        if (deps.file.indexOf('testing') === -1) {
            for (let prop of deps.propertiesClass) {
                if (this.IsAllowedScripting(prop.decorators)) {
                    filteredProperties.push(prop);
                }
            }
            for (let method of deps.methodsClass) {
                if (this.IsAllowedScripting(method.decorators)) {
                    filteredMethods.push(method);
                }
            }
            for (let output of deps.outputsClass) {
                if (this.IsAllowedScripting(output.decorators)) {
                    filteredOutputs.push(output);
                }
            }
        }

        this.flattenConfig(deps);

        deps.propertiesClass = this.inheritParents(filteredProperties, deps.configProps || []);
        deps.methodsClass = this.inheritParents(filteredMethods, deps.configMethods || []);
        deps.outputsClass = filteredOutputs;

        deps.propertiesClass = this.sortNodes(deps.propertiesClass);
        deps.methodsClass = this.sortNodes(deps.methodsClass);

        deps.inputsClass = [];
        deps.implements = [];
        deps.extends = [];
        deps.styles = null;
        deps.selector = null;
        deps.template = null;
        deps.templateUrl = [];
        deps.styles = [];
        deps.styleUrls = [];
        deps.providers = [];
        deps.constructorObj = null;
        deps.displayMetadata = false;
    }

    private filterGenericContent(deps: Deps) {
        let filteredProperties: object[] = [];
        let filteredMethods: object[] = [];


        if (deps.extends) {
            deps.properties = deps.properties.concat(this.getRecursive(deps.extends, "properties") || []);
            deps.methods = deps.methods.concat(this.getRecursive(deps.extends, "methods") || []);
        }
        if (deps.file.indexOf('testing') === -1) {
            for (let prop of deps.properties) {
                if (this.IsAllowedScripting(prop.decorators)) {
                    filteredProperties.push(prop);
                }
            }

            for (let method of deps.methods) {
                if (this.IsAllowedScripting(method.decorators)) {
                    filteredMethods.push(method);
                }
            }
        }

        deps.properties = this.sortNodes(filteredProperties);
        deps.methods = this.sortNodes(filteredMethods);
        deps.constructorObj = null;
    }

    public filterClassContent(deps: Deps) {
        deps.constructorObj = null;
        deps.implements = [];


    }
    public filterInjectableContent(deps: Deps) {
        this.filterGenericContent(deps);
    }

    private getRecursive(className, property) {
        let _class = this.classes[className];
        if (!_class)
            return [];

        let baseProp = _class[property];

        if (_class.extends) {
            let parentProperties = this.getRecursive(_class.extends, property);
            return this.inheritParents(baseProp, parentProperties);
        }
        else {
            return baseProp
        }
    }


    private existsInArray(children, element): boolean {
        let result = false;
        for (let child of children) {
            if (child.name === element.name) {
                return true;
            }
        }
        return result;
    }

    private inheritParents(children, parents) {
        for (let prop of parents) {
            if (!this.existsInArray(children, prop)) {
                children.push(prop);
            }
        }
        return children
    }

    public populateClass(className, content) {
        this.classes[className] = content;
    }

    private flattenConfig(deps) {

        for (let prop of deps.propertiesClass) {
            if (prop.name === "Config") {
                deps.configMethods = this.getRecursive(prop.type, "methods") || [];
                deps.configProps = this.getRecursive(prop.type, "properties") || [];
                break;
            }
        }
    }

    private sortNodes(nodes: any[]): any[] {
        return nodes.sort((n1, n2) => {
            if (n1.name > n2.name) {
                return 1;
            }

            if (n1.name < n2.name) {
                return -1;
            }

            return 0;
        });


    }


}