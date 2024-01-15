interface Callback {
    (...args: any[]): any;
}

interface Callbacks {
    [name: string]: {
        [namespace: string]: Callback[];
    };
}

interface Name {
    original: string;
    value: string;
    namespace: string;
}

export default class EventEmitter {
    private callbacks: Callbacks = {};

    public on(name: string, callback: Callback): void {
        const resolvedName = this.resolveName(name);

        if (!this.callbacks[resolvedName.namespace]) {
            this.callbacks[resolvedName.namespace] = {};
        }

        if (!this.callbacks[resolvedName.namespace][resolvedName.value]) {
            this.callbacks[resolvedName.namespace][resolvedName.value] = [];
        }

        this.callbacks[resolvedName.namespace][resolvedName.value].push(callback);
    }

    public off(name: string, callback: Callback): void {
        const resolvedName = this.resolveName(name);

        if (
            this.callbacks[resolvedName.namespace] &&
            this.callbacks[resolvedName.namespace][resolvedName.value]
        ) {
            const index = this.callbacks[resolvedName.namespace][resolvedName.value].indexOf(callback);

            if (index !== -1) {
                this.callbacks[resolvedName.namespace][resolvedName.value].splice(index, 1);
            }
        }
    }

    public emit(name: string, ...args: any[]): any {
        const resolvedNames = this.resolveNames(name);
        let finalResult: any;

        for (const resolvedName of resolvedNames) {
            if (!this.callbacks[resolvedName.namespace] || !this.callbacks[resolvedName.namespace][resolvedName.value]) {
                continue;
            }

            for (const callback of this.callbacks[resolvedName.namespace][resolvedName.value]) {
                const result = callback.apply(this, args);

                if (typeof finalResult === 'undefined') {
                    finalResult = result;
                }
            }
        }

        return finalResult;
    }

    private resolveNames(names: string): Name[] {
        let resolvedNames = names.replace(/[^a-zA-Z0-9 ,/.]/g, '');
        resolvedNames = resolvedNames.replace(/[,/]+/g, ' ');
        let resolvedNamesTmp = resolvedNames.split(' ');

        return resolvedNamesTmp.map((name) => this.resolveName(name));
    }

    private resolveName(name: string): Name {
        const newName: Name = {
            original: name,
            value: '',
            namespace: 'base',
        };
        const parts = name.split('.');

        newName.value = parts[0];

        if (parts.length > 1 && parts[1] !== '') {
            newName.namespace = parts[1];
        }

        return newName;
    }
}
