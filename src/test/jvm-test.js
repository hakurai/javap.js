describe("JVM Suite", function() {



    it("ローカル変数の1と10を加算してローカル変数に代入", function() {

        var frame = new JVM.Frame();

        frame.iconst_1();
        frame.istore_1();
        frame.bipush(10);
        frame.istore_2();
        frame.iload_1();
        frame.iload_2();
        frame.iadd();
        frame.istore_3();

        expect(frame.localVariable[1]).toBe(1);
        expect(frame.localVariable[2]).toBe(10);
        expect(frame.localVariable[3]).toBe(11);
    });

    it("ローカル変数の10と1を減算してローカル変数に代入", function() {

        var frame = new JVM.Frame();

        frame.bipush(10);
        frame.istore_1();
        frame.iconst_1();
        frame.istore_2();
        frame.iload_1();
        frame.iload_2();
        frame.isub();
        frame.istore_3();

        expect(frame.localVariable[1]).toBe(10);
        expect(frame.localVariable[2]).toBe(1);
        expect(frame.localVariable[3]).toBe(9);
    });

    it("ローカル変数の10と1を減算してローカル変数に代入", function() {

        var frame = new JVM.Frame();

        frame.bipush(10);
        frame.istore_1();
        frame.iconst_1();
        frame.istore_2();
        frame.iload_1();
        frame.iload_2();
        frame.isub();
        frame.istore_3();

        expect(frame.localVariable[1]).toBe(10);
        expect(frame.localVariable[2]).toBe(1);
        expect(frame.localVariable[3]).toBe(9);
    });

    it("ローカル変数の4と5を乗算してローカル変数に代入", function() {

        var frame = new JVM.Frame();

        frame.iconst_4();
        frame.istore_1();
        frame.iconst_5();
        frame.istore_2();
        frame.iload_1();
        frame.iload_2();
        frame.imul();
        frame.istore_3();

        expect(frame.localVariable[1]).toBe(4);
        expect(frame.localVariable[2]).toBe(5);
        expect(frame.localVariable[3]).toBe(20);
    });

    it("ローカル変数の4と2を除算してローカル変数に代入", function() {

        var frame = new JVM.Frame();

        frame.iconst_4();
        frame.istore_1();
        frame.iconst_2();
        frame.istore_2();
        frame.iload_1();
        frame.iload_2();
        frame.idiv();
        frame.istore_3();

        expect(frame.localVariable[1]).toBe(4);
        expect(frame.localVariable[2]).toBe(2);
        expect(frame.localVariable[3]).toBe(2);
    });

    it("intの除算は0に向かって丸められる", function() {

        var frame = new JVM.Frame();

        frame.iconst_5();
        frame.istore_1();
        frame.iconst_4();
        frame.istore_2();
        frame.iload_1();
        frame.iload_2();
        frame.idiv();
        frame.istore_3();

        expect(frame.localVariable[1]).toBe(5);
        expect(frame.localVariable[2]).toBe(4);
        expect(frame.localVariable[3]).toBe(1);
    });

    it("負のintの除算は0に向かって丸められる", function() {

        var frame = new JVM.Frame();

        frame.bipush(-4);
        frame.istore_1();
        frame.bipush(-5);
        frame.istore_2();
        frame.iload_1();
        frame.iload_2();
        frame.idiv();
        frame.istore_3();

        expect(frame.localVariable[1]).toBe(-4);
        expect(frame.localVariable[2]).toBe(-5);
        expect(frame.localVariable[3]).toBe(0);
    });
});