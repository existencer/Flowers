#version 300 es

layout (location = 0) in highp vec2 aVertexPosition;
layout (location = 1) in highp vec3 aInstanceOffset;

layout (std140) uniform uboMatrix {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};

uniform highp mat4 uModelMatrix;
uniform highp float uRadius;
uniform highp vec3 uCenterPosition;

out highp float vColor;

void main() {
  highp float diameter = uRadius * 2.0;
  highp vec3 dis = uCenterPosition + vec3(uRadius, 0.0, uRadius) - aInstanceOffset;
  highp vec3 dn = floor(dis / diameter);
  highp vec4 modelPos = uModelMatrix * vec4(aVertexPosition, 0.0, 1.0);
  highp vec4 flagPos = vec4(dn * diameter + aInstanceOffset + modelPos.xyz, 1.0);
  gl_Position = uProjectionMatrix * uViewMatrix * flagPos;
  vColor = flagPos.y;
}
