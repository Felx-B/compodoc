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
            deps.propertiesClass = deps.propertiesClass.concat(this.getRecursive(deps.extends, "properties") || []);
            deps.methodsClass = deps.methodsClass.concat(this.getRecursive(deps.extends, "methods") || []);
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

        deps.propertiesClass = filteredProperties;
        deps.methodsClass = filteredMethods;
        deps.outputsClass = filteredOutputs;
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
        deps.file = '';
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

        deps.properties = filteredProperties;
        deps.methods = filteredMethods;
        deps.constructorObj = null;
        deps.file = '';
    }

    public filterClassContent(deps: Deps) {
        this.filterGenericContent(deps);
    }
    public filterInjectableContent(deps: Deps) {
        this.filterGenericContent(deps);
    }

    private getRecursive(className, property) {
        let _class = this.classes[className];
        if (!_class)
            return [];

        if (_class.extends)
            return _class[property].concat(this.getRecursive(_class.extends, property) || []);
        else {
            return _class[property]
        }
    }

    public populateClass(className, content) {
        this.classes[className] = content;
    }

}