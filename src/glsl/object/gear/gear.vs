precision highp float;

attribute vec2 aVertexPos;
attribute mat2 aRotateZ;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

varying vec2 vTexCoord;
varying mat2 vRotateZ;

void main() {
  // vTexCoord = aVertexPos * 0.5 + vec2(0.5);
  vTexCoord = vec2(0.5 + aVertexPos.x, 1.0 - aVertexPos.y);
  vRotateZ = aRotateZ;
  vec2 fragPos = aRotateZ * aVertexPos;
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(fragPos, 0.0, 1.0);
}
