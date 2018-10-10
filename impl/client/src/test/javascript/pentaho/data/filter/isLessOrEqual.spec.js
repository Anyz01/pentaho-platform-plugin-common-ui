/*!
 * Copyright 2017 Hitachi Vantara.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
  "pentaho/data/filter/isLessOrEqual",
  "pentaho/type/Context",
  "pentaho/type/complex",
  "./propertyUtils"
], function(isLessOrEqualFactory, Context, complexFactory, propertyUtils) {

  "use strict";

  describe("pentaho.data.filter.IsLessOrEqual", function() {

    var context;
    var Complex;
    var IsLessOrEqualFilter;
    var ProductSummary;

    beforeEach(function(done) {
      Context.createAsync()
          .then(function(_context) {

            context = _context;
            Complex = context.get("complex");

            ProductSummary = Complex.extend({
              $type: {
                props: [
                  {name: "name", valueType: "string", label: "Name"},
                  {name: "sales", valueType: "number", label: "Sales"},
                  {name: "inStock", valueType: "boolean", label: "In Stock"}
                ]
              }
            });

            return context.getDependencyApplyAsync([
              "pentaho/data/filter/isLessOrEqual"
            ], function(IsLessOrEqual) {
              IsLessOrEqualFilter = IsLessOrEqual;
            });
          })
          .then(done, done.fail);

    });

    propertyUtils.behavesLikeProperty(function() { return IsLessOrEqualFilter; }, {
      valueType: "number",
      rawValue: 42,
      kind: "isLessOrEqual",
      alias: "<="
    });

    describe("#contains(elem)", function() {

      var elem;

      beforeEach(function() {
        elem = new ProductSummary({name: "A", sales: 12000, inStock: true});
      });

      it("should return `false` if `elem` has property `property` with a value > `value`", function() {

        var filter  = new IsLessOrEqualFilter({property: "sales", value: {_: "number", v: 13000}});

        var result = filter.contains(elem);

        expect(result).toBe(false);
      });

      it("should return `false` if `elem` does not have property `property`", function() {

        var filter  = new IsLessOrEqualFilter({property: "foo", value: {_: "number", v: 12000}});

        var result = filter.contains(elem);

        expect(result).toBe(false);
      });

      it("should return `true` if `elem` has property `property` with a value = `value`", function() {

        var filter  = new IsLessOrEqualFilter({property: "sales", value: {_: "number", v: 12000}});

        var result = filter.contains(elem);

        expect(result).toBe(true);
      });

      it("should return `true` if `elem` has property `property` with a value < `value`", function() {

        var filter  = new IsLessOrEqualFilter({property: "sales", value: {_: "number", v: 11000}});

        var result = filter.contains(elem);

        expect(result).toBe(true);
      });
    }); // #contains

    describe("#contentKey", function() {

      it("should return '(<= propName valueKey)'", function() {
        var filter  = new IsLessOrEqualFilter({property: "name", value: 1});

        expect(filter.$contentKey).toBe("(<= name 1)");
      });

      it("should return '(<= propName )' when no value is set'", function() {
        var filter  = new IsLessOrEqualFilter({property: "name"});

        expect(filter.$contentKey).toBe("(<= name )");
      });

      it("should return '(<=  valueKey)' when no property is set'", function() {
        var filter  = new IsLessOrEqualFilter({value: 1});

        expect(filter.$contentKey).toBe("(<=  1)");
      });

      it("should return '(<=  )' when no property or value are set'", function() {
        var filter  = new IsLessOrEqualFilter();

        expect(filter.$contentKey).toBe("(<=  )");
      });
    });
  }); // pentaho.data.filter.IsLessOrEqual
});