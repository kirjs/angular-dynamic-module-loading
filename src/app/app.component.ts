import * as AngularCore from '@angular/core';
import { Compiler, Component, Injector, ReflectiveInjector, ViewChild, ViewContainerRef } from '@angular/core';

import { COMPILER_PROVIDERS } from '@angular/compiler';
import * as AngularCommon from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <h1>
      {{title}}
    </h1>
    <input type="text" size="50">
    <button (click)="load()">Load</button>
    <ng-template #pluginHost>
      Here be dragons
    </ng-template>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  href = 'http://localhost:4200/assets/lazy.module.js';

  @ViewChild('pluginHost') pluginHost;

  private injector: Injector;
  private compiler: Compiler;

  constructor(injector: Injector, private _vcr: ViewContainerRef) {
    this.injector = ReflectiveInjector.resolveAndCreate(COMPILER_PROVIDERS, injector);
    this.compiler = this.injector.get(Compiler);
  }

  load() {
    fetch(this.href)
      .then(response => response.text())
      .then(source => {
        const exports = {}; // this will hold module exports
        const modules = {   // this is the list of modules accessible by plugin
          '@angular/core': AngularCore,
          '@angular/common': AngularCommon
        };

        const require = (module) => modules[module]; // shim 'require'

        eval(source); // interpret the plugin source

        const mwcf = this.compiler.compileModuleAndAllComponentsSync(exports['LazyModule']);

        const componentFactory = mwcf.componentFactories
          .find(e => e.selector === 'app-lazy'); // find the entry component

        if (componentFactory) {
          this._vcr.clear();

          const componentRef = this._vcr.createComponent(componentFactory);
          componentRef.instance.data = 'Some Data';
        }

      });
  }
}
