
import { cn } from "./utils";
import { expect, describe, it } from "vitest";

describe("Utils Module", () => {
    describe("cn function", () => {
        it("should merge class names correctly", () => {
            // Arrange
            const class1 = "text-left";
            const class2 = "bg-red-500";
            const class3 = "text-center"; // duplicate class to test merging

            // Act
            const result = cn(class1, class2, class3);

            // Assert
            expect(result).toBe("bg-red-500 text-center");
        });

        it("should handle falsy values", () => {
            // Arrange
            const class1 = "p-4";
            const class2 = false;
            const class3 = undefined;
            const class4 = "m-2";

            // Act
            const result = cn(class1, class2, class3, class4);

            // Assert
            expect(result).toBe("p-4 m-2");
        });
        
        it("should handle multiple inputs", () => {
            // Arrange
            const classes = ["flex", "items-center", "justify-between", "flex", "p-4"]; // 'flex' is duplicated

            // Act
            const result = cn(...classes);

            // Assert
            expect(result).toBe("items-center justify-between flex p-4");
        });
        
    });
});