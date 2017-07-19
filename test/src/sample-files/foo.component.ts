import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FooService } from './foo.service';

@Component({
	selector: 'app-foo',
	styles: [`
		.host {
			width: 100%;
		  	height: 4px;
		  	top: 0;
		  	position: fixed;
		  	left: 0px;
		}
	`],
	template: `
		<div class="host">
			<div (click)="exampleOutput.emit({foo: 'bar'})"></div>
		</div>
	`
})
export class FooComponent implements IProxy {

	private AllowedMembers: ProxyAllowed = {
		Proxy: [
			'changeLabel1',
			'changeLabel2',
			'changeLabel3',
			'changeLabel4',
			'exampleInput',
			'internalMethod',

		],
		Config: [
			'Label1',
			'Label2',
			'Label3',
			'Label4',
		]
	};

	constructor(communicationService: FooService) {

	}

	/**
	 * An example input
	 * {@link BarComponent} or [BarComponent2]{@link BarComponent} or {@link BarComponent|BarComponent3}
	 */
	@Input() exampleInput: string = 'foo';

	/**
	 * An example output
	 */
	@Output() exampleOutput: EventEmitter<{ foo: string }> = new EventEmitter();


	internalMethod(input: string): string {
		return "";

	}

	public changeLabel1: string;
	public changeLabel2: string;
	public changeLabel3: string;
	public changeLabel4: string;
	public changeLabel5: string;

}
export interface IProxy {
	AllowedMembers?: ProxyAllowed;
}

export class ProxyAllowed {
	Proxy?: string[];
	Config?: string[];
}