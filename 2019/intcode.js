
const PARAM = 1;
const ADDR = 2;


module.exports = class IntCodeComputer {
    input_values;
    relative_base = 0;

    constructor(input_values = []) {
        this.input_values = input_values.reverse();
    }

    counter = 0;
    async run(program, showASM = false, input_values = [], pipe) {
        this.input_values.push(...input_values.reverse());
        let pointer = 0;
        let opcode;
        while ((opcode = program[pointer]) !== 99/* && this.counter++ < 1000*/) {
            let operation = this.getOperation(opcode);
            
            // Extract param modes from opcode
            let paramModes = this.getParamModes(operation.params, opcode);
            let params = paramModes.map((mode, i) => {
                let param = program[pointer + i + 1] || 0;

                if (mode === 2) {
                    param += this.relative_base;
                }

                if (operation.params[i] === PARAM && mode !== 1) {
                    param = program[param] || 0;
                }

                return param;
            });
            if (showASM) this.printOp(program, pointer, operation, paramModes);
            
            let jmp = operation.op(program, ...params, pipe);
            if (jmp instanceof Promise) {
                await jmp;
                jmp = undefined;
            }
            // console.log('jmp?', jmp);
            if (jmp !== undefined) {
                pointer = jmp;
            } else {
                pointer += params.length + 1;
            }
        }
        return program;
    }

    printOp(program, pointer, op, params) {
        params = params.map((mode, i) => {
            let param = program[pointer + i + 1] || 0;
            if (mode === 1 && op.params[i] === PARAM) {
                return '#' + param;
            }
            if (mode === 2) {
                return 'R' + param;
            }
            return param;
        });
        
        console.log(op.title + ' ' + params.join(' '));
    }

    getParamModes(params, opcode) {
        let paramModes = [];
        let tmpOP = Math.floor(opcode / 100);
        for (let _ of params) {
            let mode = tmpOP % 10;
            paramModes.push(mode);
            tmpOP = Math.floor(tmpOP / 10);
        }
        return paramModes;
    }
    
    getOperation(opcode) {
        switch (opcode % 100) {
            case 1: return { title: 'ADD', op: this._add, params: [ PARAM, PARAM, ADDR ] };
            case 2: return { title: 'MUL', op: this._multiply, params: [ PARAM, PARAM, ADDR ] };

            case 3: return { title: 'INP', op: (...a) => this._input(...a), params: [ ADDR ] };
            case 4: return { title: 'OUT', op: (...a) => this._output(...a), params: [ PARAM ] };

            case 5: return { title: 'JIT', op: this._jump_if_true, params: [ PARAM, PARAM ] };
            case 6: return { title: 'JIF', op: this._jump_if_false, params: [ PARAM, PARAM ] };

            case 7: return { title: 'LTH', op: this._less_than, params: [ PARAM, PARAM, ADDR ] };
            case 8: return { title: 'EQU', op: this._equals, params: [ PARAM, PARAM, ADDR ] };
    
            case 9: return { title: 'RBA', op: (...a) => this._relative_base(...a), params: [ PARAM ] };
    
            default: throw new Error('Unknown opcode: ' + opcode);
        }
    }

    _add(prg, a, b, c) {
        prg[c] = a + b;
    }
    
    _multiply(prg, a, b, c) {
        prg[c] = a * b;
    }
    
    _input(prg, a) {
        prg[a] = this.input_values.pop();
    }
    
    async _output(prg, a, pipe) {
        if (pipe) {
            let res = await pipe(a);
            if (res != undefined) {
                let vals = res instanceof Array ? res : [ res ];
                this.input_values.splice(0, 0, ...vals);
            }
        } else {
            console.log(a);
        }
    }

    _jump_if_true(prg, a, b) {
        if (a) return b;
    }

    _jump_if_false(prg, a, b) {
        if (a == 0) return b;
    }

    _less_than(prg, a, b, c) {
        prg[c] = a < b ? 1 : 0;
    }

    _equals(prg, a, b, c) {
        prg[c] = a == b ? 1 : 0;
    }

    _relative_base(prg, a) {
        this.relative_base += a;
    }
}

