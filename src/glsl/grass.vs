#version 300 es

layout (location = 0) in highp vec2 aVertexPosition;
layout (location = 1) in highp vec3 aInstanceOffset;

uniform sampler2D uDepthTexture;

layout (std140) uniform uboMatrix {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};
layout (std140) uniform uboIsland {
  highp int uPrecision;
  highp float uMaxHeight;
  highp float uCaveDown;
};

uniform highp mat4 uModelMatrix;
uniform highp float uRadius;
uniform highp vec3 uCenterPosition;

out highp float vColor;
out highp float vDistance;

void main() {
  highp float diameter = uRadius * 2.0;
  highp vec3 dis = vec3(uCenterPosition.x, 0.0, uCenterPosition.z) + vec3(uRadius, 0.0, uRadius) - aInstanceOffset;
  highp vec3 dn = floor(dis / diameter);
  highp vec4 modelPos = uModelMatrix * vec4(aVertexPosition, 0.0, 1.0);
  highp vec3 centerPos = dn * diameter + aInstanceOffset;

  highp vec2 texCoord = (centerPos.xz * 2.0 + vec2(float(uPrecision) / 2.0)) / float(uPrecision);
  highp float depth = texture(uDepthTexture, texCoord).r * 16.0 - 4.0;
  highp float countCtrl = texture(uDepthTexture, texCoord).g;
  if (countCtrl < float(gl_InstanceID % 100) / 100.0) {
    vDistance = 0.0;
    gl_Position = vec4(0.0);
    vColor = 0.0;
  } else {
    vDistance = distance(uCenterPosition, centerPos);
    highp float grassDis = 500.0 / (vDistance + 400.0);
    highp vec4 flagPos = vec4(centerPos + modelPos.xyz * grassDis * (countCtrl + 2.0) / 3.0, 1.0);

    gl_Position = uProjectionMatrix * uViewMatrix * (flagPos + vec4(0.0, depth, 0.0, 0.0));
    vColor = flagPos.y;
  }
}
