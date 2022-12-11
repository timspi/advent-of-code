
const DATA = 1;
const ADDR = 2;


module.exports = class IntCodeComputer {

    program;
    pointer;

    input_values = [];
    result;

    loadProgram(program) {
        this.program = program;
        this.pointer = 0;
    }
    
    run() {
        this.result = undefined;
        while (true) {
            let opcode = this.program[this.pointer]
            let operation = this._getOperation(opcode);
            
            // Extract param modes from opcode
            let paramModes = this._getParamModes(operation.params, opcode);
            let params = paramModes.map((mode, i) => {
                let param = this.program[this.pointer + i + 1];
                if (mode !== 1) {
                    param = this.program[param];
                }
                return param;
            });
            
            if (operation.halt) {
                return this.result;
            }

            console.log(operation, params);
            let jmp = operation.op(this.program, ...params);
    
            if (jmp) {
                this.pointer = jmp;
            } else {
                this.pointer += params.length + 1;
            }
        }
    }

    addInputValues(...vals) {
        this.input_values.splice(0, 0, ...vals.reverse());
    }

    _getParamModes(params, opcode) {
        let paramModes = [];
        let tmpOP = Math.floor(opcode / 100);
        for (let p of params) {
            let mode = p === ADDR ? 1 : tmpOP % 10;
            paramModes.push(mode);
            tmpOP = Math.floor(tmpOP / 10);
        }
        return paramModes;
    }
    
    _getOperation(opcode) {
        switch (opcode % 100) {
            case 1: return { title: 'ADD', op: this._add, params: [ DATA, DATA, ADDR ] };
            case 2: return { title: 'MUL', op: this._multiply, params: [ DATA, DATA, ADDR ] };

            case 3:
                let val = this.input_values.pop();
                if (val === undefined) return { title: 'INP_HAL', halt: true, params: [] };
                return { title: 'INP', op: (...a) => this._input(...a, val), params: [ ADDR ] };
            
            case 4: return { title: 'OUT', op: (...a) => this._output(...a), params: [ DATA ] };

            case 5: return { title: 'JIT', op: this._jump_if_true, params: [ DATA, DATA ] };
            case 6: return { title: 'JIF', op: this._jump_if_false, params: [ DATA, DATA ] };

            case 7: return { title: 'LTH', op: this._less_than, params: [ DATA, DATA, ADDR ] };
            case 8: return { title: 'EQU', op: this._equals, params: [ DATA, DATA, ADDR ] };

            case 99: return { title: 'HAL', halt: true, params: [] };
    
            default: throw new Error('Unknown opcode: ' + opcode);
        }
    }

    _add(prg, a, b, c) {
        prg[c] = a + b;
    }
    
    _multiply(prg, a, b, c) {
        prg[c] = a * b;
    }
    
    _input(prg, a, b) {
        prg[a] = b;
    }
    
    _output(prg, a) {
        console.log(a);
        this.result = a;
    }

    _jump_if_true(prg, a, b) {
        if (a) return b;
    }

    _jump_if_false(prg, a, b) {
        if (!a) return b;
    }

    _less_than(prg, a, b, c) {
        prg[c] = a < b ? 1 : 0;
    }

    _equals(prg, a, b, c) {
        prg[c] = a == b ? 1 : 0;
    }
}

