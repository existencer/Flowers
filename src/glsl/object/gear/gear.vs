precision highp float;

attribute vec2 aVertexPos;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aVertexPos * 0.5 + vec2(0.5);
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos, 0.0, 1.0);
}
