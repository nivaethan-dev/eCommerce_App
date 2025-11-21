{
  "version": "2.5.0",
  "summary": {
    "title": "Threat Model for our e-Commerce System",
    "owner": "Group 10",
    "description": "STRIDE-based threat model for the e-commerce application with clearly defined process boundaries for penetration testing"
  },
  "detail": {
    "contributors": [
      {
        "name": "R. Nivaethan (FC222008)"
      },
      {
        "name": "W.D.C.S. Gunathunga (FC222017)"
      },
      {
        "name": "M.N.F Afrina (FC222001)"
      },
      {
        "name": "K.G.A.K.S. Sathsarani (FC222015)"
      }
    ],
    "diagrams": [
      {
        "id": 0,
        "title": "E-Commerce System DFD",
        "diagramType": "STRIDE",
        "placeholder": "New STRIDE diagram description",
        "thumbnail": "./public/content/images/thumbnail.stride.jpg",
        "version": "2.5.0",
        "cells": [
          {
            "position": {
              "x": -50,
              "y": 20
            },
            "size": {
              "width": 350,
              "height": 1100
            },
            "attrs": {
              "text": {
                "text": "Internet Trust Boundary"
              },
              "body": {
                "strokeWidth": 2,
                "strokeDasharray": "8 4",
                "stroke": "#FF0000"
              }
            },
            "visible": true,
            "shape": "trust-boundary-box",
            "zIndex": 0,
            "id": "internet-boundary",
            "data": {
              "type": "tm.BoundaryBox",
              "name": "Internet Trust Boundary",
              "description": "External users accessing the system from the internet - untrusted zone",
              "isTrustBoundary": true,
              "threats": [],
              "hasOpenThreats": false
            }
          },
          {
            "position": {
              "x": 320,
              "y": 20
            },
            "size": {
              "width": 1400,
              "height": 1100
            },
            "attrs": {
              "text": {
                "text": "Application Trust Boundary"
              },
              "body": {
                "strokeWidth": 2,
                "strokeDasharray": "8 4",
                "stroke": "#0000FF"
              }
            },
            "visible": true,
            "shape": "trust-boundary-box",
            "zIndex": 0,
            "id": "application-boundary",
            "data": {
              "type": "tm.BoundaryBox",
              "name": "Application Trust Boundary",
              "description": "Protected backend services and databases - trusted internal zone",
              "isTrustBoundary": true,
              "threats": [],
              "hasOpenThreats": false
            }
          },
          {
            "position": {
              "x": 50,
              "y": 150
            },
            "size": {
              "width": 120,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Customer"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "actor",
            "zIndex": 1,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "0a368dab-8cf5-457a-baad-5bbdc5c2efab"
                },
                {
                  "group": "right",
                  "id": "4bb9de8f-fe24-464a-a48d-705fc231b35d"
                },
                {
                  "group": "bottom",
                  "id": "793141f2-d110-4391-be84-06a2712abd0f"
                },
                {
                  "group": "left",
                  "id": "312d2c30-96fd-468b-a47a-a54626d60771"
                }
              ]
            },
            "id": "customer",
            "data": {
              "type": "tm.Actor",
              "name": "Customer",
              "description": "Authenticated customer using the e-commerce platform",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "providesAuthentication": false,
              "threats": [
                {
                  "id": "725884de-a21b-445a-b104-f849a0241fe1",
                  "title": "Customer Spoofing",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Spoofing",
                  "description": "Provide a description for this threat. A customer could attempt to impersonate another registered customer to gain unauthorized access to their account or personal data.",
                  "mitigation": "Enforce strong authentication (passwords, MFA)\n\nMonitor unusual login activity\n\nLock accounts after multiple failed login attempts",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 102,
                  "score": ""
                },
                {
                  "id": "c7d88dfa-c19e-4c77-99d0-c25487770ca4",
                  "title": "Customer Repudiation",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "A customer could deny performing actions like placing an order or updating account details.",
                  "mitigation": "Maintain tamper-proof audit logs\n\nTimestamp all transactions",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 103,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 1,
                "repudiation": 1
              }
            }
          },
          {
            "position": {
              "x": 50,
              "y": 500
            },
            "size": {
              "width": 120,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Guest"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "actor",
            "zIndex": 2,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "ed6b2bd1-58ce-4bab-a0f6-7e80e31073f2"
                },
                {
                  "group": "right",
                  "id": "c271ca99-435d-4407-ba49-7670a8823d69"
                },
                {
                  "group": "bottom",
                  "id": "364b5771-640e-4cf7-9a2f-162fefe39a53"
                },
                {
                  "group": "left",
                  "id": "0ab147cb-3647-418a-958d-847aa5220fac"
                }
              ]
            },
            "id": "guest",
            "data": {
              "type": "tm.Actor",
              "name": "Guest",
              "description": "Unauthenticated user browsing products",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "providesAuthentication": false,
              "threats": [
                {
                  "id": "87b1e922-9838-437e-9992-1960d52922bf",
                  "title": "Guest Spoofing",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Spoofing",
                  "description": " A guest (unauthenticated user) could attempt to impersonate another user or manipulate session identifiers to gain unauthorized access to system functionality or view restricted information.",
                  "mitigation": "- Validate all session tokens\n- Rate-limit API requests\n- Monitor unusual access patterns",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 104,
                  "score": ""
                },
                {
                  "id": "e5b1d5f3-dcbc-4c78-97ce-49e7d78d8ef5",
                  "title": "Guest Repudiation",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "A guest could deny sending requests or accessing certain APIs, making it difficult to track malicious activity or abuse.",
                  "mitigation": "Log all guest requests with IP, user agent, and timestamps\n\nUse server-side request validation\n\nImplement anomaly detection for unusual traffic",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 105,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 1,
                "repudiation": 1
              }
            }
          },
          {
            "position": {
              "x": 50,
              "y": 850
            },
            "size": {
              "width": 120,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Admin"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "actor",
            "zIndex": 3,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "9ba57a70-b971-4729-87e3-496f07de9e28"
                },
                {
                  "group": "right",
                  "id": "93ab7cb2-72ce-483a-823a-73064031e675"
                },
                {
                  "group": "bottom",
                  "id": "3a736297-073b-4920-86e5-c61e85c39402"
                },
                {
                  "group": "left",
                  "id": "16aedfc6-ff5c-479b-a0f4-ffd303d4c713"
                }
              ]
            },
            "id": "admin",
            "data": {
              "type": "tm.Actor",
              "name": "Admin",
              "description": "Administrative user managing the platform",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "providesAuthentication": false,
              "threats": [
                {
                  "id": "122a9b26-3a53-415f-8f92-0cdd5562d16f",
                  "title": "Admin Spoofing",
                  "status": "Open",
                  "severity": "High",
                  "type": "Spoofing",
                  "description": " An attacker could attempt to impersonate an admin to gain unauthorized access to backend functionality, modify critical data, or manage other users.",
                  "mitigation": "- Enforce strong authentication (password + MFA)\n- Restrict admin access via IP whitelisting\n- Monitor and alert on suspicious admin logins\n- Use role-based access controls to limit privileges",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 106,
                  "score": ""
                },
                {
                  "id": "4c70dbeb-df11-4457-ad47-922bee8f29e4",
                  "title": "Admin Repudiation",
                  "status": "Open",
                  "severity": "High",
                  "type": "Repudiation",
                  "description": "An admin could deny performing actions such as modifying user accounts, updating products, or deleting orders, potentially hiding malicious or erroneous activities.",
                  "mitigation": "- Maintain detailed audit logs with timestamps and user IDs\n- Require digital signatures or confirmation for critical actions\n- Implement immutable logging where possible",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 107,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 1,
                "repudiation": 1
              }
            }
          },
          {
            "position": {
              "x": 400,
              "y": 70
            },
            "size": {
              "width": 140,
              "height": 100
            },
            "attrs": {
              "text": {
                "text": "Auth Service"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "process",
            "zIndex": 4,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "b94f6285-8070-4142-86ac-27ff63e330d2"
                },
                {
                  "group": "right",
                  "id": "f65f2ec9-8f75-4df7-8a76-269a6b5e55bb"
                },
                {
                  "group": "bottom",
                  "id": "e8ab5fcf-a16c-4869-9064-4693a7d7746d"
                },
                {
                  "group": "left",
                  "id": "250f73c4-cd79-4934-80d4-bb1e491ff65b"
                }
              ]
            },
            "id": "auth-service",
            "data": {
              "type": "tm.Process",
              "name": "Auth Service",
              "description": "Authentication and authorization service - maps to auth controller/service",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "privilegeLevel": "",
              "threats": [
                {
                  "id": "d4c35179-86ce-4ad1-a1e2-f958986aa070",
                  "title": "Auth Service Spoofing: Impersonation of Users or Admins",
                  "status": "Open",
                  "severity": "High",
                  "type": "Spoofing",
                  "description": "An attacker could attempt to log in as another user or admin by using stolen credentials, session tokens, or exploiting flaws in login mechanisms. Successful spoofing allows unauthorized access to protected areas, including the Customer Service, Order Service, Product Service, and Admin Service endpoints.",
                  "mitigation": "Use strong password policies and secure password storage (hashing + salting).\n\nMonitor login patterns and alert on anomalous activity.\n\nLock accounts temporarily after repeated failed login attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 108,
                  "score": ""
                },
                {
                  "id": "0f9b5e92-5ab1-4f03-b866-ac45fb42bcdd",
                  "title": "Auth Service Tampering: Modification of Authentication Requests or Responses",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "An attacker could modify authentication traffic or payloads to bypass security controls, elevate privileges, or manipulate session data. Examples include changing JSON fields in API requests, replaying or altering JWT tokens, or tampering with login challenge responses.",
                  "mitigation": "Use HTTPS for all communication to prevent in-transit tampering.\n\nValidate all inputs server-side, including token and session data.\n\nImplement integrity checks (e.g., HMAC for tokens).\n\nReject malformed or replayed requests.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 109,
                  "score": ""
                },
                {
                  "id": "0bc1d48b-d6e0-4538-b97f-43d4d972f304",
                  "title": "Auth Service Repudiation: Denial of Authentication Actions",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "A user could deny having attempted a login, logged out, or performed other authentication-related actions. Without tamper-proof logging, it becomes difficult to verify whether authentication requests originated from the legitimate user or were malicious.",
                  "mitigation": "Maintain tamper-proof audit logs of authentication attempts, timestamp all actions.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 110,
                  "score": ""
                },
                {
                  "id": "f1122da2-b3f3-48d9-a5b4-d7fc32cf3e5c",
                  "title": "Auth Service Information Disclosure: Exposure of Credentials or Tokens",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "An attacker could gain access to passwords, session tokens, or secret keys due to insecure storage, transmission, or verbose error messages. Exposure can lead to account takeover or unauthorized system access.",
                  "mitigation": "Hash and salt all passwords before storage.\n\nEncrypt tokens and sensitive authentication data at rest and in transit.\n\nLimit error messages to avoid revealing whether a username or password was correct.\n\nRotate and expire tokens regularly.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 111,
                  "score": ""
                },
                {
                  "id": "f2e4fb9a-71df-4457-924d-94ad8b8a7c1c",
                  "title": "Auth Service Denial of Service: Disruption of Authentication endpoints",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may flood the authentication endpoints with repeated login attempts, API requests, or malformed payloads, preventing legitimate users from logging in and potentially impacting downstream services that rely on authentication.",
                  "mitigation": "Rate limiting, autoscaling, monitor traffic anomalies.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 112,
                  "score": ""
                },
                {
                  "id": "499b80ad-f02a-474e-8098-136edf34c513",
                  "title": "Auth Service Elevation of Privilege: Privilege Escalation via Authentication Flaws",
                  "status": "Open",
                  "severity": "High",
                  "type": "Elevation of privilege",
                  "description": "An attacker could exploit weaknesses in the authentication logic such as predictable session tokens, improper role assignment, or bypassing login checks to escalate from a regular user account to an administrative account. This could allow the attacker to access all system data, modify other users’ accounts, and perform restricted admin operations.",
                  "mitigation": "Enforce strict server-side role validation for every request\n\nSecurely generate, validate, and expire session tokens\n\nRegularly review and patch authentication-related vulnerabilities\n\nImplement least-privilege access controls and logging for all privilege changes",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 113,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 2,
                "tampering": 2,
                "repudiation": 2,
                "informationDisclosure": 2,
                "denialOfService": 3,
                "elevationOfPrivilege": 3
              },
              "isWebApplication": null
            }
          },
          {
            "position": {
              "x": 400,
              "y": 240
            },
            "size": {
              "width": 140,
              "height": 100
            },
            "attrs": {
              "text": {
                "text": "Customer Service"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "process",
            "zIndex": 5,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "4162afde-0ce7-4b04-94eb-cc01f17e4fed"
                },
                {
                  "group": "right",
                  "id": "f9204cd9-a2dc-4912-bbc2-4be06c6015e8"
                },
                {
                  "group": "bottom",
                  "id": "5cef0f13-8124-4661-8def-89df673c77ec"
                },
                {
                  "group": "left",
                  "id": "c0563e19-1f79-40ba-ae36-85b5a25f88f9"
                }
              ]
            },
            "id": "customer-service",
            "data": {
              "type": "tm.Process",
              "name": "Customer Service",
              "description": "Customer profile and account management - maps to customer controller/service",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "privilegeLevel": "",
              "threats": [
                {
                  "id": "44495265-8922-4772-905d-4af0661d4724",
                  "title": "Customer Service Spoofing: Unauthorized Access via Customer Identity Spoofing",
                  "status": "Open",
                  "severity": "High",
                  "type": "Spoofing",
                  "description": "An attacker could impersonate another customer by reusing stolen session tokens, forging authentication credentials, or manipulating cookies. This allows them to access or modify another customer’s account data, including profile information, addresses, and preferences.",
                  "mitigation": "Authentication tokens, session validation, access control checks.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 114,
                  "score": ""
                },
                {
                  "id": "3de56f2b-725d-4a92-a9b7-3f6811de6f29",
                  "title": "Customer Service Tampering: Unauthorized Modification of Customer Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "An attacker could exploit weaknesses in the Customer Service API to alter customer profile data without authorization. This includes changing names, addresses, phone numbers, or account preferences. Vulnerabilities such as missing server‑side validation, insecure direct object references (IDOR), or weak session handling could allow modification of another user’s profile data.",
                  "mitigation": "Enforce strict authorization (user can only modify their own profile)\n\nValidate and sanitize all incoming profile update requests\n\nUse non‑guessable customer identifiers internally\n\nMaintain audit logs of all profile‑related changes",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 115,
                  "score": ""
                },
                {
                  "id": "0fbd1ab2-5d00-4236-9123-c8ab1742a091",
                  "title": "Customer Service Repudiation: Denial of Customer Actions",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "Customers could deny performing actions such as updating profiles or submitting orders. Without proper tracking, it becomes difficult to prove the legitimacy of customer actions, leading to potential disputes or financial loss.",
                  "mitigation": "Maintain immutable audit logs with timestamps, implement digital signatures for critical operations, and store logs securely for dispute resolution.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 116,
                  "score": ""
                },
                {
                  "id": "1387b6e3-15d9-41b4-a498-32182f65b898",
                  "title": "Customer Service Information Disclosure: Unauthorized Access to Customer Personal Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Sensitive customer data including emails, addresses, phone numbers, payment details, and order history could be exposed due to insufficient access controls, insecure APIs, or unencrypted storage, leading to privacy breaches or identity theft.",
                  "mitigation": "Enforce role-based access control (customers can only access their own data).\n\nEncrypt sensitive data both at rest and in transit.\n\nAudit and log all access to personal data.\n\nLimit data returned in API responses to only necessary fields.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 117,
                  "score": ""
                },
                {
                  "id": "0f9c9c86-eb5f-4494-98be-c9614dc64bd4",
                  "title": "Customer Service Denial of Service: Disruption of Customer Account Access",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers could overwhelm customer service endpoints such as APIs, forms, or chat systems with excessive requests, causing slow response times or complete service outages, which prevents legitimate customers from accessing services.",
                  "mitigation": "Implement rate limiting and request throttling per user/IP.\n\nUse load balancing and autoscaling to handle legitimate traffic spikes.\n\nMonitor traffic patterns and detect anomalies for early mitigation.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 118,
                  "score": ""
                },
                {
                  "id": "d457bce4-9738-4c6f-a212-b8e617354c3c",
                  "title": "Customer Service Elevation of Privilege: Unauthorized Access to Admin or Restricted Functions or Other Users",
                  "status": "Open",
                  "severity": "High",
                  "type": "Elevation of privilege",
                  "description": "An attacker could exploit flaws in the business logic of Customer Service such as missing authorization checks, insecure APIs, or predictable user identifiers to access or modify other customers’ data. For example, the attacker could change another user’s profile, view order history, or update personal information without permission.",
                  "mitigation": "Enforce strict server-side authorization for every API call.\n\nImplement ownership checks (users can only modify their own data).\n\nBlock guest access to any account-specific endpoints.\n\nConduct security-focused code reviews to identify logic flaws.\n\nLog and monitor all sensitive operations.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 119,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 3,
                "tampering": 4,
                "repudiation": 2,
                "informationDisclosure": 3,
                "denialOfService": 2,
                "elevationOfPrivilege": 3
              }
            }
          },
          {
            "position": {
              "x": 400,
              "y": 410
            },
            "size": {
              "width": 140,
              "height": 100
            },
            "attrs": {
              "text": {
                "text": "Order Service"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "process",
            "zIndex": 6,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "4dbc411a-f22e-4d0a-bfd1-093c088ac254"
                },
                {
                  "group": "right",
                  "id": "3be664d9-310c-435d-bba0-a6c4943504f0"
                },
                {
                  "group": "bottom",
                  "id": "e4b54cf8-d041-46ce-85f3-194bc841984b"
                },
                {
                  "group": "left",
                  "id": "0b1ac271-59c3-4012-8e9f-010533f39968"
                }
              ]
            },
            "id": "order-service",
            "data": {
              "type": "tm.Process",
              "name": "Order Service",
              "description": "Order processing and management - maps to order controller/service",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "privilegeLevel": "",
              "threats": [
                {
                  "id": "f0e62074-6304-4415-804f-df5707183152",
                  "title": "Order Service Spoofing: Unauthorized Order Action via Identity Spoofing",
                  "status": "Open",
                  "severity": "High",
                  "type": "Spoofing",
                  "description": "An attacker may attempt to impersonate another customer by submitting forged authentication tokens or replaying stolen session IDs to access the Order Service. Successful spoofing would allow the attacker to place orders using another user’s account, cancel legitimate orders, or retrieve order histories belonging to other customers.",
                  "mitigation": "Enforce strict token validation (expiration, signature, issuer).\n\nImplement session binding to device/IP where appropriate.\n\nDetect and block session replay attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 120,
                  "score": ""
                },
                {
                  "id": "eff3bbc5-5953-460a-b864-6507a1d98ae2",
                  "title": "Order Service Tampering: Manipulation of Order Data and Transaction Values",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "An attacker could intercept or forge requests to alter order attributes, such as product quantity, order totals, or applied discounts. Business logic flaws (e.g., client‑side price calculation, insecure state transitions, or IDOR) may enable attackers to reduce prices, change order status, or assign orders to a different customer.",
                  "mitigation": "Perform all pricing and total calculations server-side.\n\nEnforce strict order‑state validation (user cannot arbitrarily set “Paid,” “Shipped,” etc.).\n\nValidate all request payloads for integrity.\n\nUse non‑guessable order identifiers.\n\nApply HMAC or server-side recomputation for critical fields.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 121,
                  "score": ""
                },
                {
                  "id": "2ec90dbc-4639-4ee0-9d7c-7fc8b6bab1d7",
                  "title": "Order Service Repudiation: Denial of Order-Related Actions",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "A customer or attacker may deny having placed, updated, or canceled an order. Without tamper‑proof logging, the system cannot reliably prove whether an order action originated from the authenticated user, creating audit gaps and enabling fraudulent refund or cancellation claims.",
                  "mitigation": "Implement append‑only, tamper-resistant audit logs.\n\nCapture order events with timestamps, IP address, and hashed user identifiers.\n\nGenerate digital order confirmations and email receipts.\n\nUse log integrity verification (e.g., hashing, chain-link logs).",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 122,
                  "score": ""
                },
                {
                  "id": "e4fdc86e-bd1f-40e4-8fc2-bf36799700f8",
                  "title": "Order Service Information Disclosure: Exposure of Order Details and Customer Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Insufficient access control or insecure API design may expose order history, delivery addresses, payment references, or product lists belonging to other customers. This can occur via direct object reference attacks, verbose error messages, or insecure serialization of order objects.",
                  "mitigation": "Enforce authorization checks on every order retrieval endpoint.\n\nEncrypt sensitive fields (addresses, contact numbers, payment tokens).\n\nAvoid returning unnecessary internal order attributes in API responses.\n\nLog access to sensitive data for monitoring and forensics.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 123,
                  "score": ""
                },
                {
                  "id": "78f439a0-7903-4539-a07d-485b26e4faac",
                  "title": "Order Service Denial of Service: Disruption of Order Placement and Processing",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may flood the Order Service API with excessive order creation attempts, payment callbacks, or order‑status polling requests. This can overwhelm the service, resulting in legitimate customers being unable to place or complete orders, and may disrupt downstream services (payment provider, product inventory).",
                  "mitigation": "Apply rate limiting on all high‑cost endpoints.\n\nImplement request throttling and CAPTCHA for unauthenticated flows.\n\nUse autoscaling for peak load protection.\n\nMonitor for abnormal spikes in API usage and trigger alerts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 124,
                  "score": ""
                },
                {
                  "id": "65d8a95f-d387-4f50-80cf-fb83008dab6e",
                  "title": "Order Service Elevation of Privilege: Unauthorized Manipulation of Other Users’ Orders",
                  "status": "Open",
                  "severity": "High",
                  "type": "Elevation of privilege",
                  "description": "An attacker may exploit authorization flaws in the Order Service to access or alter orders belonging to other users, or perform privileged workflow actions such as marking an order as “Paid,” “Shipped,” or “Cancelled.” Logic flaws, missing ownership checks, and improper use of user IDs in the API can enable cross‑user order control or unauthorized escalation to admin-level operations.",
                  "mitigation": "Enforce ownership validation for every order operation (requesting user must match order owner).\n\nRestrict privileged actions (e.g., status transitions) to authorized roles.\n\nUse server‑side authorization frameworks and avoid client‑based role hints.\n\nConduct security-focused code reviews for workflow logic.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 125,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 2,
                "tampering": 3,
                "repudiation": 1,
                "informationDisclosure": 2,
                "denialOfService": 1,
                "elevationOfPrivilege": 1
              },
              "handlesCardPayment": null,
              "isWebApplication": null
            }
          },
          {
            "position": {
              "x": 400,
              "y": 580
            },
            "size": {
              "width": 140,
              "height": 100
            },
            "attrs": {
              "text": {
                "text": "Product Service"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "process",
            "zIndex": 7,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "908ba658-82ea-4e33-9f4f-6fcb554602ef"
                },
                {
                  "group": "right",
                  "id": "b7143358-0f45-48e4-944f-11a6dca51ddd"
                },
                {
                  "group": "bottom",
                  "id": "6521c970-0d61-4b59-b4e1-3ada2dfdd49f"
                },
                {
                  "group": "left",
                  "id": "965e866b-7b4f-4d67-bbd3-a648a01a04cc"
                }
              ]
            },
            "id": "product-service",
            "data": {
              "type": "tm.Process",
              "name": "Product Service",
              "description": "Product catalog and inventory management - maps to product controller/service",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "privilegeLevel": "",
              "threats": [
                {
                  "id": "cd691c19-3d99-4ddc-bb6c-df40b87208b3",
                  "title": "Product Service Spoofing: Unauthorized Product Action via Identity Spoofing",
                  "status": "Open",
                  "severity": "High",
                  "type": "Spoofing",
                  "description": "An attacker could impersonate an admin or authorized user by reusing stolen session tokens or forging authentication credentials. This could allow the attacker to create, modify, or delete product entries without proper authorization, potentially affecting pricing, stock, or product availability.",
                  "mitigation": "Enforce MFA and strong authentication for admin users.\n\nValidate all tokens server-side and bind sessions to device/IP.\n\nMonitor login attempts and detect suspicious patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 126,
                  "score": ""
                },
                {
                  "id": "33b7bc95-4ff3-46ed-83d0-2127730abb59",
                  "title": "Product Service Tampering: Product Data Manipulation",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "An attacker could tamper with product data in transit or at rest, such as prices, stock levels, or descriptions. This can occur through insecure APIs, lack of input validation, or client-side manipulation, enabling fraudulent price changes, inaccurate stock reporting, or misleading product descriptions.",
                  "mitigation": "Validate all incoming requests server-side.\n\nEnforce admin-level access controls for product modifications.\n\nUse HTTPS and integrity checks for all API communications.\n\nMaintain audit logs for all product changes.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 127,
                  "score": ""
                },
                {
                  "id": "794a4a8d-194c-44dd-88fa-05eb6c9dacb5",
                  "title": "Product Service Repudiation: Denial of Product Modifications",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "A malicious or careless admin could deny performing product-related actions (create, update, delete), making it difficult to verify accountability. Without tamper-proof logging, disputed changes could go untracked.",
                  "mitigation": "Implement append-only audit logs with timestamps and user identifiers.\n\nUse digital signatures for critical product updates.\n\nKeep versioned records of product changes.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 128,
                  "score": ""
                },
                {
                  "id": "597fd97e-8472-4897-9fa0-2c8eac8bbe98",
                  "title": "Product Service Information Disclosure: Unauthorized Access to Product Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Flawed access control could allow attackers to view sensitive product information, including unpublished products, pricing, stock levels, or admin-only metadata. Exposure could lead to competitive leakage or inventory manipulation.",
                  "mitigation": "Apply strict role-based access control for all endpoints.\n\nEncrypt sensitive data at rest and in transit.\n\nLog and monitor all product data accesses.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 129,
                  "score": ""
                },
                {
                  "id": "7721c6b2-1c9f-4c18-b30e-68adfab6f81f",
                  "title": "Product Service Denial of Service: Disruption of Product Service Availability",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers could flood product service endpoints (e.g., bulk product requests, update spam), rendering the catalog or admin interfaces unavailable. This impacts both customers browsing products and admins managing inventory.",
                  "mitigation": "Apply rate limiting and throttling on high-cost endpoints.\n\nUse autoscaling and load balancing to absorb spikes.\n\nDetect and alert on abnormal traffic patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 130,
                  "score": ""
                },
                {
                  "id": "ffc22e07-8501-41f1-8a0f-23905938b9a9",
                  "title": "Product Service Elevation of Privilege: Unauthorized Product Modification via Logic Flaws",
                  "status": "Open",
                  "severity": "High",
                  "type": "Elevation of privilege",
                  "description": "An attacker could exploit business logic flaws or missing authorization checks to perform admin-only actions, such as altering product prices, stock levels, or visibility. Exploitation could allow non-admin users to manipulate critical product information.",
                  "mitigation": "Enforce server-side authorization for all admin-level actions.\n\nValidate user roles and session integrity for every request.\n\nConduct regular code reviews to identify and fix logic vulnerabilities.\n\nMaintain audit trails of all privileged operations.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 131,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 1,
                "tampering": 1,
                "repudiation": 1,
                "informationDisclosure": 1,
                "denialOfService": 2,
                "elevationOfPrivilege": 2
              },
              "isWebApplication": null,
              "handlesCardPayment": null
            }
          },
          {
            "position": {
              "x": 400,
              "y": 950
            },
            "size": {
              "width": 140,
              "height": 100
            },
            "attrs": {
              "text": {
                "text": "Admin Service"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "process",
            "zIndex": 8,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "448bb0f7-9f0a-497b-9193-6b2cfa65ebd2"
                },
                {
                  "group": "right",
                  "id": "73f2ef6c-794d-4763-98c4-161d60b5ab2b"
                },
                {
                  "group": "bottom",
                  "id": "be223639-115c-4128-ae2f-03e28c32101f"
                },
                {
                  "group": "left",
                  "id": "2377f926-e8c5-4e9c-a8fb-b43b6ebd47ef"
                }
              ]
            },
            "id": "admin-service",
            "data": {
              "type": "tm.Process",
              "name": "Admin Service",
              "description": "Administrative operations and management - maps to admin controller/service",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "privilegeLevel": "",
              "threats": [
                {
                  "id": "7fe01f86-717f-420d-8ea6-5290fa3cc165",
                  "title": "Admin Service Spoofing: Unauthorized Access via Admin Identity Spoofing",
                  "status": "Open",
                  "severity": "High",
                  "type": "Spoofing",
                  "description": "An attacker may attempt to impersonate an admin account by replaying stolen tokens, forging cookies, or brute-forcing admin credentials. Successful impersonation grants full access to backend operations such as editing users, modifying products, adjusting orders, or accessing system dashboards.",
                  "mitigation": "Enforce MFA for all admin accounts\n\nImplement IP allowlists or VPN-gated access for admin portal\n\nBind sessions to device/IP and detect token anomalies\n\nMonitor and alert on unusual admin login locations or patterns",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 132,
                  "score": ""
                },
                {
                  "id": "a771476b-5e1d-4052-a2b6-01450af5ba76",
                  "title": "Admin Service Tampering: Unauthorized Modification of Administrative Data",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "If authorization checks or API validation are weak, an attacker could alter critical backend data, such as changing product prices, editing order states, or injecting malicious configuration values. Such tampering can fully compromise the business workflow and data integrity.",
                  "mitigation": "Enforce server-side validation for all admin actions\n\nProtect admin endpoints with RBAC and least-privilege\n\nRequire confirmation for high-impact operations\n\nMaintain immutable audit logs of administrative changes",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 133,
                  "score": ""
                },
                {
                  "id": "f8e2633f-527c-42a0-a725-c24bf291116a",
                  "title": "Admin Service Repudiation: Denial of Critical Administrative Actions",
                  "status": "Open",
                  "severity": "High",
                  "type": "Repudiation",
                  "description": "An admin may deny performing actions such as changing user roles, deleting products, adjusting stock, or modifying order statuses. Without reliable logging and event attribution, malicious or accidental admin actions cannot be traced, creating gaps in accountability.",
                  "mitigation": "Implement tamper-proof, append-only audit logs\n\nRecord timestamps, admin ID, IP, and action details\n\nUse signed administrative actions or confirmation tokens\n\nStore logs in a secure, isolated audit database",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 134,
                  "score": ""
                },
                {
                  "id": "ebee1152-688a-465e-bdee-3346cc14b21b",
                  "title": "Admin Service Information Disclosure: Exposure of Sensitive Administrative or System Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Weak access controls or overly permissive endpoints may leak internal administrative data, including user role mappings, system configuration, order summaries, unpublished product data, or operational dashboards. Such disclosure gives attackers insights to plan targeted attacks or manipulate system behavior.",
                  "mitigation": "Restrict all admin endpoints to authorized roles only\n\nHide internal fields from API responses\n\nEncrypt sensitive logs and configuration data\n\nMonitor for suspicious access to admin-only resources",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 135,
                  "score": ""
                },
                {
                  "id": "e54d0086-35b6-41a7-bac8-57099d8d2c53",
                  "title": "Admin Service Denial of Service: Disruption of Administrative Operations",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may spam admin endpoints (e.g., product update, user search, role assignment) or trigger expensive backend operations to overwhelm the Admin Service. This prevents legitimate administrators from performing essential tasks such as updating catalogs, responding to incidents, or managing customer issues.",
                  "mitigation": "Apply rate limiting to administrative APIs\n\nIsolate admin workloads from public traffic\n\nMonitor and alert on abnormal request spikes\n\nDeploy redundancy and autoscaling for backend operations",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 136,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "spoofing": 1,
                "tampering": 2,
                "repudiation": 1,
                "informationDisclosure": 1,
                "denialOfService": 1,
                "elevationOfPrivilege": 0
              },
              "isWebApplication": false,
              "handlesCardPayment": null
            }
          },
          {
            "position": {
              "x": 950,
              "y": 200
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Customer Database"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "topline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              },
              "bottomline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "store",
            "zIndex": 9,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "64e72394-ee5e-4f89-a80e-607ab05fb351"
                },
                {
                  "group": "right",
                  "id": "37eb9b90-898a-4b4e-a377-4d423f38052c"
                },
                {
                  "group": "bottom",
                  "id": "94828a40-5bee-4adf-b056-595cb047cdbf"
                },
                {
                  "group": "left",
                  "id": "3042b593-ab28-4b69-818c-7e3daa191c8d"
                }
              ]
            },
            "id": "customer-db",
            "data": {
              "type": "tm.Store",
              "name": "Customer Database",
              "description": "Stores customer account information, credentials, and profiles",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isALog": false,
              "isEncrypted": false,
              "isSigned": false,
              "storesCredentials": true,
              "storesInventory": false,
              "threats": [
                {
                  "id": "4287fcb3-f945-472e-9c21-b0fc7301f519",
                  "title": "Customer DB Tampering: Unauthorized Modification of Customer Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Attackers could modify or corrupt customer records, including profiles, addresses, contact information, or preferences, by exploiting weak database permissions, injection attacks, or unvalidated API input. Such tampering can lead to data integrity issues, incorrect order processing, or financial loss.",
                  "mitigation": "Implement role-based access control (RBAC) and least-privilege permissions for database users.\n\nUse parameterized queries or prepared statements to prevent injection attacks.\n\nValidate all inputs on the server side and enforce strict schema validation.\n\nMaintain versioned backups and implement database integrity checks.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 137,
                  "score": ""
                },
                {
                  "id": "f67cb383-ed6e-4701-a6a4-bd2854c6d8e9",
                  "title": "Customer Database Repudiation: Denial of Customer Data Changes",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "Modifications to customer data could go untracked if audit logs are missing or tampered with, allowing attackers or insiders to deny having made changes. This prevents accountability and makes it difficult to investigate or resolve disputes.",
                  "mitigation": "Implement append-only audit logs with timestamps, user IDs, and operation details.\n\nDigitally sign critical updates to ensure tamper-evidence.\n\nStore logs in a secure, isolated system separate from the main database.\n\nRegularly monitor and verify log integrity.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 138,
                  "score": ""
                },
                {
                  "id": "bef312f3-b1ff-4f51-9287-6c53a1a917c6",
                  "title": "Customer Database Information Disclosure: Exposure of Sensitive Customer Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Unauthorized access could reveal sensitive customer information, such as emails, addresses, payment details, and purchase history. This can occur due to misconfigured permissions, insufficient encryption, or exploitation of vulnerabilities in APIs or database interfaces.",
                  "mitigation": "Encrypt sensitive data at rest using industry-standard encryption (e.g., AES-256).\n\nUse TLS/HTTPS for all database and API communications to secure data in transit.\n\nApply fine-grained access controls so only authorized services or personnel can access sensitive data.\n\nAudit and log all access to sensitive fields and monitor for anomalous activity.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 139,
                  "score": ""
                },
                {
                  "id": "be98eb0a-d776-4dd8-8df9-c6c9daa173cb",
                  "title": "Customer Database Denial of Service: Disruption of Customer Database Availability",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "The database could be rendered unavailable by flooding queries, exploiting locking mechanisms, resource exhaustion, or triggering expensive operations. This can block legitimate customers from accessing accounts or placing orders.",
                  "mitigation": "Implement rate limiting and throttling for API calls to the database.\n\nUse connection pooling and query timeouts to protect resources.\n\nDeploy replication and failover clusters to maintain availability.\n\nMonitor database metrics (CPU, memory, query execution time) and alert on anomalies.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 140,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "repudiation": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            }
          },
          {
            "position": {
              "x": 1200,
              "y": 120
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Admin Database"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "topline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              },
              "bottomline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "store",
            "zIndex": 10,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "823feccf-14f7-40ba-80d5-4d42c5450ca6"
                },
                {
                  "group": "right",
                  "id": "1bdbc272-c9e3-40c4-9b5a-29842d107dc2"
                },
                {
                  "group": "bottom",
                  "id": "dbd3ba8f-4814-4373-9d9e-3a4cace64688"
                },
                {
                  "group": "left",
                  "id": "6f1f01e1-f5b5-4754-a4bd-36ad4c8fdf7d"
                }
              ]
            },
            "id": "admin-db",
            "data": {
              "type": "tm.Store",
              "name": "Admin Database",
              "description": "Stores admin user accounts and permissions",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isALog": false,
              "isEncrypted": false,
              "isSigned": false,
              "storesCredentials": true,
              "storesInventory": false,
              "threats": [
                {
                  "id": "672f917c-fce1-4783-9c1c-fb10c6017096",
                  "title": "Admin Database Tampering: Unauthorized Modification of Admin Accounts or Permissions",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Attackers or malicious insiders could attempt to modify administrative user accounts, privilege levels, or permission mappings stored in the Admin Database. Successful tampering may lead to unauthorized administrative access, alteration of system configurations, or complete compromise of security controls.",
                  "mitigation": "Enforce strict role-based access control (RBAC) with least-privilege principles.\n\nImplement parameterized queries and strong server-side input validation to prevent injection attacks.\n\nRestrict modification rights to dedicated admin services, not application clients.\n\nEnable database auditing to track changes to admin-related tables and detect anomalies.\n\nUse cryptographically protected storage for privileged account records.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 145,
                  "score": ""
                },
                {
                  "id": "e1bb2f12-9ab0-4c4a-9da0-3b060329a2c5",
                  "title": "Admin Database Repudiation: Inability to Attribute Administrative Actions",
                  "status": "Open",
                  "severity": "High",
                  "type": "Repudiation",
                  "description": "Without proper logging or tamper-resistant audit trails, administrators could deny modifying permissions, altering configuration values, or performing sensitive actions. This lack of accountability undermines compliance, incident response, and forensic investigations.",
                  "mitigation": "Write admin operations to immutable, append-only audit logs stored separately.\n\nUtilize digital signatures or cryptographic integrity mechanisms for high-value administrative events.\n\nMaintain timestamped, verifiable change histories for all admin tables.\n\nPerform regular log integrity checks to detect unauthorized changes.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 146,
                  "score": ""
                },
                {
                  "id": "d34eae2b-6bc9-4072-a1b4-fd69ef4ad3d4",
                  "title": "Admin Database Information Disclosure: Exposure of Privileged Account Details or Permissions",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Unauthorized access to the Admin Database may reveal sensitive information such as admin usernames, hashed passwords, 2FA configurations, permission schemes, or system-wide configuration values. Attackers may use this intelligence to plan privilege escalation or targeted attacks.",
                  "mitigation": "Encrypt sensitive data at rest and enforce strict read-access controls.\n\nSegregate the Admin Database behind network isolation (e.g., separate VLAN or security group).\n\nMonitor and alert on suspicious query patterns targeting admin tables.\n\nApply least-privilege access policies for services and staff.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 147,
                  "score": ""
                },
                {
                  "id": "21a852e1-9379-4682-af36-ef72269b8608",
                  "title": "Admin Database Denial of Service: Disruption of Administrative Operations Through Resource Exhaustion",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may overload the Admin Database using excessive queries, abusive automation, or resource-intensive operations. This could delay or block critical administrative tasks such as updating system settings, managing user roles, or monitoring security logs.",
                  "mitigation": "Implement rate limiting and connection throttling for admin-related endpoints.\n\nUse query optimization, indexing, and efficient schema design to reduce load.\n\nDeploy replication and failover nodes to maintain availability under heavy demand.\n\nEnable resource monitoring with alerts for unusual spikes in admin DB activity.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 148,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "repudiation": 1,
                "informationDisclosure": 1,
                "denialOfService": 2
              }
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Authentication Request",
              "description": "Customer authentication request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customer-auth-1",
            "source": {
              "cell": "customer"
            },
            "target": {
              "cell": "auth-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Customer Data Request",
              "description": "Request for customer profile/account operations",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customer-customerservice-1",
            "source": {
              "cell": "customer"
            },
            "target": {
              "cell": "customer-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Request",
              "description": "Customer order creation/management request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customer-orderservice-1",
            "source": {
              "cell": "customer"
            },
            "target": {
              "cell": "order-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Product Browse Request",
              "description": "Customer product catalog browsing request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customer-productservice-1",
            "source": {
              "cell": "customer"
            },
            "target": {
              "cell": "product-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Guest Product Request",
              "description": "Guest user product browsing request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-guest-productservice-1",
            "source": {
              "cell": "guest"
            },
            "target": {
              "cell": "product-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Auth Request",
              "description": "Admin authentication request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-admin-auth-1",
            "source": {
              "cell": "admin"
            },
            "target": {
              "cell": "auth-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Management Request",
              "description": "Administrative operations request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-admin-adminservice-1",
            "source": {
              "cell": "admin"
            },
            "target": {
              "cell": "admin-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Customer Data Read",
              "description": "Read customer profile data",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customerservice-customerdb-read",
            "source": {
              "cell": "customer-service"
            },
            "target": {
              "cell": "customer-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Product Query",
              "description": "Query product availability and pricing",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-orderservice-productdb-read",
            "source": {
              "cell": "order-service"
            },
            "target": {
              "cell": "product-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Write",
              "description": "Write order transaction data",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-orderservice-orderdb-read",
            "source": {
              "cell": "order-service"
            },
            "target": {
              "cell": "order-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Product Query",
              "description": "Query product catalog data",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-productservice-productdb-read",
            "source": {
              "cell": "product-service"
            },
            "target": {
              "cell": "product-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Data Read",
              "description": "Read admin user data",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": false,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": []
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-adminservice-admindb-read",
            "source": {
              "cell": "admin-service"
            },
            "target": {
              "cell": "admin-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Authentication Response",
              "description": "Authentication token/session response",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "e314d04b-cab7-4dba-ab08-7d5e001bd0ec",
                  "title": "Manipulation of Authentication Payloads",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "An attacker positioned on the network path or operating through a compromised client environment may intercept the authentication request and manipulate credential fields, inject crafted JSON structures, or alter token metadata before it reaches the Auth Service.\n\nThis could be used to: Bypass client-side validation, Modify roles or flags embedded in tokens, Insert malicious characters to exploit backend parsing logic, Trick the Auth Service into issuing a valid session for an invalid or elevated identity\n\nThis threat becomes especially dangerous in environments where the authentication endpoint accepts JSON or token-based payloads that can be modified silently.",
                  "mitigation": "Enforce strong TLS 1.2+ with HSTS to ensure transport integrity.\n\nValidate all authentication fields server-side only, rejecting unexpected structures.\n\nImplement integrity verification mechanisms (e.g., signed parameters or HMAC).\n\nDetect and block abnormal request shapes via API threat detection.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 157,
                  "score": ""
                },
                {
                  "id": "bfc2bbe5-1786-423b-be61-13ef206cde14",
                  "title": "Exposure of Credentials During Transmission",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Information disclosure",
                  "description": "Credentials or authentication secrets may be intercepted through Man-in-the-Middle attacks, compromised network infrastructure, rogue Wi-Fi access points, transparent proxies, or malicious browser extensions, allowing attackers to capture raw passwords, authentication cookies, JWT tokens, device identifiers, or one-time tokens. Captured secrets can be replayed, brute-forced offline, or used for impersonation, potentially leading to full account compromise and lateral access to other services that rely on the authentication provider.",
                  "mitigation": "Mandate TLS 1.2+ with strong cipher suites and certificate pinning.\n\nStore tokens using HttpOnly, Secure, SameSite flags.\n\nAvoid sending any credentials in URL query parameters.\n\nAuto-rotate session tokens at regular intervals.\n\nMonitor for TLS downgrade attempts or cert mismatch events.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 158,
                  "score": ""
                },
                {
                  "id": "6a6190a6-b306-4ae4-b1de-a6f33d824549",
                  "title": "Exhaustion of Authentication Capacity",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may intentionally overload the authentication endpoint using automated credential stuffing, high-volume API floods, repeated malformed requests, or parallel bot-driven login sequences. Because authentication operations often involve CPU-intensive processes such as hashing, token signing, and encryption, even a moderately sized attack can exhaust server resources, preventing legitimate users from logging in and degrading dependent services. Attacks during peak login hours can amplify the impact and cause significant service disruption.",
                  "mitigation": "Apply multi-layer rate limiting by user, IP, and device; implement bot mitigation, CAPTCHA triggers, and device trust scoring; deploy autoscaling and resource isolation to maintain availability; and monitor traffic for unusual concurrency patterns to block abusive origins.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 159,
                  "score": ""
                },
                {
                  "id": "98d5eb12-4763-416a-81f9-21bad428ae62",
                  "title": "Manipulation of Authentication Tokens in Transit",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "An attacker positioned on the network path or operating via a compromised proxy could intercept and modify authentication tokens such as JWTs, session IDs, or opaque tokens before they reach the client. Attack techniques include altering claims or embedded roles in a JWT, swapping tokens with stolen or previously used tokens, or injecting malicious payloads that exploit token parsing flaws. Successful tampering could allow the attacker to escalate privileges, impersonate another user, or bypass access controls in downstream services such as Customer Service, Order Service, or Product Service.",
                  "mitigation": "Use signed JWTs, enforce TLS for all communications, implement token integrity checks, and validate tokens server-side to prevent unauthorized modifications.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 160,
                  "score": ""
                },
                {
                  "id": "c0d47216-4195-47ef-b90b-284999754e65",
                  "title": "Interception and Theft of Authentication Tokens",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Information disclosure",
                  "description": "Authentication tokens could be stolen during transmission or from insecure client-side storage. Attack vectors include Man-in-the-Middle attacks over unencrypted connections, rogue browser extensions or malware harvesting tokens, and insecure storage of session tokens in web storage or logs. Compromised tokens allow attackers to fully impersonate a user, gain unauthorized access to sensitive services, data, or actions, and potentially bypass multi-step authentication flows if refresh tokens or long-lived sessions are exposed.",
                  "mitigation": "Use HttpOnly, Secure, and SameSite cookie flags to protect tokens from client-side access; transmit all tokens over TLS 1.2 or higher with strict certificate validation; implement short-lived access tokens with refresh token rotation; monitor and invalidate tokens on anomalous usage or suspected compromise; and avoid storing tokens in insecure client-side locations such as localStorage or sessionStorage.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 161,
                  "score": ""
                },
                {
                  "id": "8f9bb13c-ec0a-4717-b715-20e5e149a790",
                  "title": "Blocking of Authentication Responses",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers could intentionally prevent authentication responses from reaching the customer by flooding or dropping responses, exploiting network misconfigurations, or manipulating middleboxes. This can result in users being unable to log in or maintain active sessions, downstream services depending on authentication becoming partially or fully unavailable, and potential masking of concurrent attacks such as session hijacking or token reuse.",
                  "mitigation": "Implement resilient retry mechanisms in clients and service endpoints, monitor outbound response failures and anomalous network patterns, deploy redundant authentication service endpoints and load balancers to absorb DoS effects, and use application-level timeouts, backoff strategies, and alerting to detect abnormal delays or dropped response",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 162,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 4,
                "informationDisclosure": 3,
                "denialOfService": 3
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-auth-customer-1",
            "source": {
              "cell": "auth-service"
            },
            "target": {
              "cell": "customer"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Customer Data Response",
              "description": "Customer profile/account data response",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "910e9346-5daf-40bf-9496-9e8653dbf608",
                  "title": "Tampering of Customer Requests and Responses",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Attackers may modify profile update requests (changing email, phone, or preferences) to affect another user’s data. Similarly, malicious actors or compromised intermediaries could alter responses from the service, e.g., sending incorrect account data or injecting unsafe content. Business logic flaws like missing ownership checks exacerbate this risk.",
                  "mitigation": "Enforce HTTPS/TLS for all communications.\n\nPerform server-side input validation and enforce ownership/authorization checks.\n\nUse cryptographic integrity checks (HMAC or signatures) for sensitive fields.\n\nImplement audit logging for all critical data changes.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 163,
                  "score": ""
                },
                {
                  "id": "06dfbc4f-ce92-4fe9-8048-0da0550a6552",
                  "title": "Interception of Customer Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Sensitive customer information (emails, addresses, phone numbers) could be intercepted in transit due to network sniffing, MITM attacks, or unsecured Wi-Fi. Unencrypted or verbose API responses may expose data beyond the authenticated user’s scope.",
                  "mitigation": "Use TLS 1.2+ and enforce HSTS.\n\nEncrypt sensitive fields both in transit and at rest.\n\nLimit data returned in API responses to the minimum required.\n\nApply field-level access controls and logging to monitor unauthorized access attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 164,
                  "score": ""
                },
                {
                  "id": "dbf19315-bfc4-4b68-9ece-32dc3efdf8f8",
                  "title": "Denial of Service on Customer Operations",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may flood profile endpoints with excessive requests, preventing legitimate users from viewing or updating their profiles. This can also impact downstream services like Order Service if operations depend on customer data.",
                  "mitigation": "Implement rate limiting per user/IP and API key.\n\nUse load balancing, autoscaling, and traffic shaping to handle spikes.\n\nMonitor for abnormal traffic patterns and trigger automated alerts.\n\nApply CAPTCHA or challenge-response mechanisms for suspicious activity.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 165,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customerservice-customer-1",
            "source": {
              "cell": "customer-service"
            },
            "target": {
              "cell": "customer"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Response",
              "description": "Order confirmation/status response",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "306bc697-0f68-4f2f-987a-0fd03dfb358c",
                  "title": "Order Request Tampering",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Attackers may modify order data before it reaches the server, including quantities, prices, shipping addresses, or applied discounts. Business logic flaws or missing server-side validation could allow unauthorized changes to other users’ orders.",
                  "mitigation": "Enforce server-side validation of all order fields and recalculate totals server-side.\n\nImplement ownership checks to ensure users can only modify their own orders.\n\nUse HTTPS/TLS for all communication and validate input payloads.\n\nLog all modifications with user ID and timestamps for auditing.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 166,
                  "score": ""
                },
                {
                  "id": "6d3b57bd-3d35-4bd9-9615-35ffc225cad8",
                  "title": "Order Response Information Disclosure",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Sensitive order details in the response such as customer names, addresses, phone numbers, payment metadata, and order history could be exposed to unauthorized parties if the response is intercepted in transit. Attackers could gain access to personal or financial information without modifying the data.",
                  "mitigation": "Use TLS or HTTPS with strong ciphers for all server-client communication.\n\nEncrypt sensitive fields within the response payload.\n\nMinimize data exposure by only including necessary fields in API responses.\n\nMonitor and log access to sensitive responses and alert on unusual patterns or repeated requests.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 167,
                  "score": ""
                },
                {
                  "id": "2c1bbb42-725d-489e-bc0d-903842b0aaa1",
                  "title": "Order Service Denial of Service",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers may flood order endpoints with excessive requests, preventing legitimate customers from placing, updating, or retrieving orders. This could also impact downstream services like payment processing or inventory updates.",
                  "mitigation": "Implement rate limiting, request throttling, and CAPTCHA for unauthenticated endpoints.\n\nUse autoscaling, load balancing, and resource isolation to absorb traffic spikes.\n\nMonitor traffic patterns and detect anomalies for early mitigation.\n\nQueue high-cost operations to prevent service overload.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 168,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-orderservice-customer-1",
            "source": {
              "cell": "order-service"
            },
            "target": {
              "cell": "customer"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Product Data Response",
              "description": "Product catalog data response to customer",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "dda9499e-0f25-4347-b6ae-2f0c8d8eab7b",
                  "title": "Product Request Tampering",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Tampering",
                  "description": "Attackers may manipulate product requests by altering query parameters, injecting invalid filters or categories, or tampering with sorting options. This could cause incorrect product data to be returned, unauthorized data access, or business logic abuse (e.g., price or discount manipulation if poorly validated).",
                  "mitigation": "Validate all request parameters server-side.\n\nEnforce strict type and range checks on filters, sorting, and category inputs.\n\nReject malformed or suspicious requests with proper error handling.\n\nLog unusual or repeated tampering attempts for monitoring.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 169,
                  "score": ""
                },
                {
                  "id": "e9a9a503-8ce6-404b-a9f8-6e85e6cfcddd",
                  "title": "Product Data Interception",
                  "status": "Open",
                  "severity": "Low",
                  "type": "Information disclosure",
                  "description": "Sensitive internal product metadata, such as stock levels, internal IDs, or unpublished product info, could be exposed to attackers if responses are intercepted in transit or excessive data is returned. Even if most data is public, leakage could aid targeted attacks or inventory manipulation.",
                  "mitigation": "Use HTTPS/TLS for all server-client communications.\n\nLimit API responses to only necessary fields.\n\nAvoid exposing internal identifiers, flags, or sensitive metadata.\n\nMonitor API usage for anomalous access patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 170,
                  "score": ""
                },
                {
                  "id": "d5489266-8986-4f77-85bb-056ad36da239",
                  "title": "Product Service Denial of Service",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may flood product endpoints with excessive requests (e.g., massive catalog retrievals, bulk filtering queries), making product browsing or search unavailable for legitimate users. High-cost queries may also impact backend performance.",
                  "mitigation": "Implement caching for frequent queries to reduce backend load.\n\nApply rate limiting, request throttling, and anomaly detection per IP or user.\n\nUse CDNs and load balancing to absorb spikes in traffic.\n\nMonitor for repeated high-cost queries and trigger alerts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 171,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-productservice-customer-1",
            "source": {
              "cell": "product-service"
            },
            "target": {
              "cell": "customer"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Data Flow",
              "description": "",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "82f9c4cb-5fd0-48af-9e9e-1160c41ecce4",
                  "title": "Tampering of Registration/Login Input: Unauthorized Modification of Guest Input",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "A malicious actor could manipulate the input fields in registration or login requests, including email, username, or password, to bypass validation rules, exploit business logic, or inject malicious payloads. This can compromise data integrity or trigger application errors.",
                  "mitigation": "Enforce HTTPS/TLS for all requests to prevent interception and modification in transit.\n\nValidate all inputs server-side using strict schema checks.\n\nSanitize input to prevent injection attacks (e.g., SQL, NoSQL, XSS).\n\nImplement rate limiting and reject malformed requests.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 172,
                  "score": ""
                },
                {
                  "id": "9c230f32-e789-46fa-b906-84593cd90131",
                  "title": "Interception of Guest Credentials: Disclosure of Registration/Login Data in Transit",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Sensitive information submitted by a guest, such as email, username, or password, could be captured via man-in-the-middle attacks, packet sniffing, or misconfigured network endpoints. Exposure of these credentials may lead to account compromise or future impersonation.",
                  "mitigation": "Enforce TLS 1.2+ with strong ciphers and HSTS headers.\n\nNever transmit credentials in query parameters; use POST requests.\n\nImplement secure cookie flags (HttpOnly, Secure, SameSite) for any session identifiers issued post-registration/login.\n\nMonitor network for anomalous access patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 173,
                  "score": ""
                },
                {
                  "id": "f27c8e0c-5bc1-41d6-9e4b-8c76db76fb5f",
                  "title": "Denial of Service on Guest Authentication Endpoints: Disruption of Guest Registration/Login Services",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may flood guest-facing registration or login endpoints with repeated requests, malformed payloads, or automated bots, preventing legitimate users from creating accounts or authenticating. High load may also impact downstream services relying on authentication.",
                  "mitigation": "Apply rate limiting and request throttling at the API gateway.\n\nIntegrate CAPTCHA or bot-detection mechanisms for guest registration/login.\n\nImplement autoscaling and redundancy for authentication services.\n\nMonitor traffic anomalies and trigger alerts for unusual request patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 174,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              "Data Flow"
            ],
            "id": "2071e97a-3ba7-40eb-bbf7-6185d503e21f",
            "source": {
              "cell": "guest",
              "port": "ed6b2bd1-58ce-4bab-a0f6-7e80e31073f2"
            },
            "target": {
              "cell": "auth-service",
              "port": "b94f6285-8070-4142-86ac-27ff63e330d2"
            },
            "vertices": [
              {
                "x": 60,
                "y": 380
              },
              {
                "x": 20,
                "y": 70
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Product Management",
              "description": "Admin product catalog management request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "018505b2-b951-430f-9191-96b9d95eee02",
                  "title": "Tampering of Admin Product Updates",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "An attacker could manipulate requests sent from the admin interface to the Product Service in order to modify critical product information. This includes changing product prices, descriptions, stock levels, or deleting products entirely. Such tampering could result in financial loss, misrepresentation of product availability, and damage to business credibility. Attackers may exploit weak server-side validation, insufficient authorization checks, or insecure transport channels to perform these actions.",
                  "mitigation": "Enforce HTTPS/TLS for all communications between the admin interface and the Product Service.\n\nImplement strict role-based access control to ensure only authorized administrators can modify product data.\n\nValidate all request payloads server-side to verify expected fields, types, and value ranges.\n\nMaintain immutable audit logs of all product updates, including timestamps and administrator identifiers.\n\nMonitor traffic and update patterns for anomalies to detect potential tampering attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 184,
                  "score": ""
                },
                {
                  "id": "d2ddbefd-8817-459c-909e-a2a696f7a9f1",
                  "title": "Interception or Leakage of Admin Product Data",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Information disclosure",
                  "description": "Requests from the admin interface may expose sensitive product information, including unpublished products, internal stock levels, or pricing metadata. Interception of this data could allow competitors, attackers, or malicious insiders to gain an advantage or exploit business logic. Because admin endpoints often provide broader access than customer-facing APIs, such exposure poses a significant operational and reputational risk.",
                  "mitigation": "Enforce strict role-based access control to limit access to sensitive product data to authorized admin accounts only.\n\nFilter API responses to return only the fields necessary for each operation, hiding internal metadata.\n\nEncrypt all data in transit using TLS and sensitive fields at rest using strong encryption algorithms.\n\nRestrict network access to admin endpoints to trusted internal networks or VPN connections.\n\nContinuously audit and log access to product data and trigger alerts on anomalous patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 185,
                  "score": ""
                },
                {
                  "id": "46e964bc-a9f9-45d6-8955-a1049626a631",
                  "title": "Denial of Service on Admin Product Management",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers could flood admin product endpoints with excessive requests, malformed payloads, or repeated updates in order to exhaust server resources. This may prevent administrators from updating product details, managing stock, or publishing new items, thereby disrupting catalog management and potentially impacting customers or dependent systems. Denial of service attacks may also reduce confidence in the reliability of the platform.",
                  "mitigation": "Apply rate limiting and request throttling for all admin product endpoints to prevent abuse.\n\nImplement monitoring and anomaly detection to identify suspicious traffic targeting admin APIs.\n\nIsolate admin workloads from public-facing endpoints to minimize exposure.\n\nUse autoscaling and load balancing to maintain service availability during legitimate high traffic periods.\n\nMaintain detailed logging of all admin requests to support incident investigation and mitigation.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 186,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-admin-productservice-1",
            "source": {
              "cell": "admin"
            },
            "target": {
              "cell": "product-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Management Response",
              "description": "Administrative operation results",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "d62c7037-e0ec-4eaa-8afe-cd16bd36c13c",
                  "title": "Tampering of Admin Requests",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "An attacker could manipulate requests sent by administrators to the Admin Service to perform unauthorized actions. This includes changing user roles, modifying product information, banning users, or updating configuration settings. Exploiting weak input validation, insufficient server-side authorization checks, or insecure transport could allow attackers to bypass intended controls, potentially compromising the integrity of the entire administrative system. Such tampering can result in operational disruption, privilege abuse, and unauthorized modifications that are difficult to detect.",
                  "mitigation": "Enforce HTTPS/TLS for all communication between the admin interface and the Admin Service.\n\nValidate all request payloads server-side for structure, data types, and value ranges.\n\nApply strict role-based access control and least privilege principles to restrict what each admin can perform.\n\nMaintain immutable, append-only audit logs with timestamps, admin identifiers, and action details.\n\nMonitor admin activity in real-time for unusual patterns or high-risk operations.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 187,
                  "score": ""
                },
                {
                  "id": "874cabcf-30c2-4188-843d-0c97825a3c04",
                  "title": "Interception of Admin Data",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Information disclosure",
                  "description": "Admin Service endpoints handle highly sensitive operational data, including user account details, product inventories, system configurations, and order management information. Interception of these requests or responses could provide attackers with insights to bypass security controls, target high-value operations, or conduct insider attacks. Such data leakage can severely compromise operational security and business integrity.",
                  "mitigation": "Encrypt all traffic between admin clients and the Admin Service using TLS 1.2 or higher.\n\nEnforce strict role-based access control to ensure sensitive data is only available to authorized admins.\n\nEncrypt sensitive data at rest using strong cryptographic algorithms.\n\nRestrict access to admin endpoints through network segmentation, VPN, or internal firewalls.\n\nContinuously monitor and log access to all admin-sensitive data and raise alerts on anomalous access patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 188,
                  "score": ""
                },
                {
                  "id": "16872094-eca7-4351-8ed0-c47377ebd0ae",
                  "title": "Denial of Service on Admin Service",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers may target the Admin Service with excessive requests, malformed payloads, or resource-intensive operations to disrupt normal administrative functions. This can prevent administrators from performing critical tasks such as managing users, updating products, or monitoring the system. Denial of service attacks against admin endpoints can impact operational continuity, delay incident response, and create potential windows for additional attacks.",
                  "mitigation": "Implement rate limiting, throttling, and request queuing to prevent overload of admin endpoints.\n\nDeploy autoscaling and load balancing to maintain availability under high traffic.\n\nUse firewall rules and intrusion detection/prevention systems to filter malicious traffic.\n\nIsolate administrative operations from public-facing endpoints to reduce attack surface.\n\nMaintain detailed logging of admin requests and monitor for patterns indicative of DoS attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 189,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-adminservice-admin-1",
            "source": {
              "cell": "admin-service"
            },
            "target": {
              "cell": "admin"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Order Management",
              "description": "Admin order management request",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "bb8bb5b2-d8a7-4ee5-8d40-f1c91bf4119d",
                  "title": "Tampering of Admin Order Updates",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "An attacker could manipulate requests sent from the admin interface to the Order Service in order to modify critical order details. This includes changing customer information, altering order status, forcing cancellations, or adjusting shipping options. Such tampering could compromise order integrity, disrupt business operations, and result in financial losses or customer dissatisfaction. Attackers could exploit weak server-side validation, insufficient access control, or insecure APIs to perform these actions.",
                  "mitigation": "Enforce strict HTTPS/TLS encryption to protect all data in transit between the admin interface and the Order Service.\n\nApply server-side role-based access control to ensure only authorized administrators can perform sensitive order updates.\n\nValidate all input fields and request payloads against expected types and ranges on the server side.\n\nLog and monitor all order modifications for anomalous patterns, and alert on suspicious updates.\n\nConduct regular security reviews of admin API endpoints to identify logic flaws that could allow tampering.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 181,
                  "score": ""
                },
                {
                  "id": "3fe65518-36b7-419e-80d1-8823909f1a09",
                  "title": "Interception of Admin Order Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Requests from the admin interface may expose complete customer orders, including sensitive information such as names, addresses, contact numbers, payment details, and order history. If an attacker intercepts these requests, it could lead to privacy violations, identity theft, or targeted attacks. Such exposure is particularly critical because admin endpoints typically provide broader access than customer-facing APIs and could reveal all orders in the system.",
                  "mitigation": "Encrypt all communications using TLS to prevent interception of sensitive data.\n\nEnforce strict role-based access controls to ensure only authorized admin accounts can access order data.\n\nImplement field-level encryption for sensitive information stored or transmitted between services.\n\nSegment network access so that only trusted internal services can reach admin APIs.\n\nMonitor all access to admin order data and maintain detailed audit logs of retrievals.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 182,
                  "score": ""
                },
                {
                  "id": "286eb629-05fb-4943-ba8e-eca209f8cea0",
                  "title": "Denial of Service on Admin Order Operations",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers may attempt to flood the admin order endpoints with excessive requests, malformed payloads, or repeated status updates in order to exhaust server resources. This could prevent administrators from processing or tracking orders, delay fulfillment, and disrupt customer service operations. Such denial of service attacks could also impact downstream services that depend on the Order Service, amplifying the operational impact.",
                  "mitigation": "Implement rate limiting and request throttling for all admin order endpoints to prevent resource exhaustion.\n\nDeploy anomaly detection to identify and block suspicious traffic patterns targeting administrative APIs.\n\nIsolate administrative workloads from public-facing endpoints to reduce exposure.\n\nUse autoscaling and load balancing to handle legitimate traffic spikes while maintaining service availability.\n\nMaintain continuous monitoring and alerting to respond quickly to DoS attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 183,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-admin-orderservice-1",
            "source": {
              "cell": "admin"
            },
            "target": {
              "cell": "order-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Auth Response",
              "description": "Admin authentication token response",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "daae6d86-2918-4654-8841-54cbe824aa69",
                  "title": "Tampering With Admin Authentication Requests",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Attackers may intercept or manipulate admin authentication requests in transit, injecting modified parameters, altering role claims, or modifying payload structure to exploit vulnerabilities in the authentication flow. Because admin logins unlock privileged actions, any manipulation of request fields such as forced elevation, bypass flags, or malformed JSON can result in unauthorized administrative access or unintended system behavior.",
                  "mitigation": "Enforce strict server‑side validation and schema checking for authentication payloads.\n\nReject any request containing unexpected parameters, altered role claims, or modified data structures.\n\nApply TLS with certificate pinning to prevent MITM-based tampering.\n\nUse signed, integrity‑protected authentication tokens and avoid trusting any client‑supplied role or privilege indicators.\n\nMonitor and log all failed admin authentication attempts with anomaly detection.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 178,
                  "score": ""
                },
                {
                  "id": "295daa7c-6c8c-450d-b56f-d7d2e84a3b42",
                  "title": "Admin Credential Interception",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Information disclosure",
                  "description": "Admin credentials are high‑value targets, and attackers intercepting traffic, especially over compromised networks or during phishing-induced redirections may capture login details, enabling full administrative compromise.",
                  "mitigation": "Enforce TLS 1.2+, HSTS, MFA, secure cookie flags, IP allow‑listing for admin access, and continuous monitoring for suspicious login attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 179,
                  "score": ""
                },
                {
                  "id": "8d888c6c-9598-45aa-8d5e-d0e58201e87d",
                  "title": "Admin Authentication DoS",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers may target the admin authentication endpoints with excessive or malformed requests. Because admins have limited entry points, a successful DoS could delay critical operations such as user management, fraud response, or system monitoring.",
                  "mitigation": "Rate limiting, WAF filtering, IP throttling, backend autoscaling, and automated alerting for unusual request patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 180,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-auth-admin-1",
            "source": {
              "cell": "auth-service"
            },
            "target": {
              "cell": "admin"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Guest Product Response",
              "description": "Product catalog data response to guest",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "cb7a4285-2d7e-48e9-81e5-46c19b9a50f2",
                  "title": "Unauthorized Product Data Exposure or Scraping",
                  "status": "Open",
                  "severity": "Low",
                  "type": "Information disclosure",
                  "description": "Guests could systematically access product endpoints to scrape catalog data, stock levels, pricing, or internal identifiers. Even publicly visible data may reveal competitive insights, usage patterns, or allow enumeration of internal resources.",
                  "mitigation": "Implement API rate limiting and request throttling per IP or session.\n\nUse bot detection mechanisms, CAPTCHAs, or API keys for bulk data requests.\n\nLimit the amount of metadata returned in API responses.\n\nMonitor access logs for abnormal scraping patterns and block abusive clients.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 175,
                  "score": ""
                },
                {
                  "id": "41aefbc3-8eb1-4712-b089-45866ec7823f",
                  "title": "Denial of Service on Product Endpoints by Guests",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Guests may flood product endpoints with repeated requests or malformed queries, consuming server or database resources, making product browsing or API access unavailable for legitimate users. This could also degrade performance for dependent services.",
                  "mitigation": "Apply rate limiting and request throttling at the API gateway.\n\nUse caching and CDN for frequently requested resources to reduce load.\n\nImplement CAPTCHA or bot-detection for excessive or automated requests.\n\nMonitor traffic patterns and set up alerts for abnormal spikes.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 176,
                  "score": ""
                },
                {
                  "id": "55a0d831-48ef-4086-aa9c-6e889398f188",
                  "title": "Injection or Tampering of Guest Requests: Unauthorized Modification of Product Service Requests",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Tampering",
                  "description": "Guests, being unauthenticated, may attempt to manipulate API requests, such as modifying query parameters, sorting, or filtering fields, to bypass intended restrictions, trigger unintended behavior, or probe business logic flaws. Malformed inputs could also exploit vulnerabilities in server-side code or database queries.",
                  "mitigation": "Enforce strict server-side input validation and type checking for all API parameters.\n\nSanitize all inputs to prevent injection attacks (NoSQL injection, command injection, etc.).\n\nApply least-privilege access control even for read-only endpoints.\n\nMonitor anomalous request patterns and block suspicious clients.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 177,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 2,
                "informationDisclosure": 2,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-productservice-guest-1",
            "source": {
              "cell": "product-service"
            },
            "target": {
              "cell": "guest"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Customer Auth Query",
              "description": "Query customer credentials",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "285456f9-d292-4f0c-b2e2-1c4ef42507ee",
                  "title": "Man-in-the-Middle Attack on Credential Query Traffic",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "An attacker with network-level access intercepts the communication channel between Auth Service and Customer Database to modify authentication queries or database responses in transit. The attacker could alter credential verification queries to bypass authentication, modify password hashes being transmitted, or tamper with authentication result responses to grant unauthorized access.",
                  "mitigation": "Enforce TLS 1.3 with perfect forward secrecy for all database connections\n\nEnable TLS certificate validation with strict hostname verification\n\nUse certificate pinning (if using mobile or browser client access)\n\nImplement database connection integrity checks (e.g., using secure drivers and verifying connection state)",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 193,
                  "score": ""
                },
                {
                  "id": "8432f882-cfcd-4e56-9029-ffdbb0c381bf",
                  "title": "Credential Data Interception During Network Transmission",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Information disclosure",
                  "description": "An attacker with network access captures authentication traffic between Auth Service and Customer Database to extract sensitive credential information. Unencrypted or weakly encrypted database connections expose password hashes, salts, usernames, authentication tokens, and user identifiers to network sniffing attacks.",
                  "mitigation": "Enforce TLS 1.3 encryption (minimum TLS 1.2) for all database connections with strong cipher suites\n\nDisable weak ciphers and protocols (SSLv3, TLS 1.0, TLS 1.1, RC4, DES)\n\nEnable perfect forward secrecy (PFS) cipher suites (ECDHE, DHE)",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 194,
                  "score": ""
                },
                {
                  "id": "555d484a-fda8-4583-a285-bfbe9bd35e08",
                  "title": "Network-Level Connection Flooding and Bandwidth Exhaustion",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "An attacker floods the network path or database connection endpoints with excessive traffic, exhausting network bandwidth, overwhelming connection handling capacity, or saturating database listener resources. This prevents legitimate authentication queries from reaching the database, causing system-wide login failures.",
                  "mitigation": "Use connection pooling with maximum connection limits at the service layer\n\nConfigure database listener connection limits\n\nImplement network firewall rules restricting database access to known service IPs only\n\nImplement circuit breakers at the service layer to fail fast on connection timeouts\n\nUse TCP SYN cookies (usually just enabling a kernel setting on Linux)",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 195,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-authservice-customerdb-1",
            "source": {
              "cell": "auth-service"
            },
            "target": {
              "cell": "customer-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Auth Query",
              "description": "Query admin credentials",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "ca76cad1-2458-4c1d-881c-1ecef910aaf8",
                  "title": "Man-in-the-Middle Attack on Admin Authentication Traffic",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network-level attackers intercept and modify admin authentication traffic between Auth Service and Admin Database. Tampered packets could alter admin credential queries, modify privilege verification responses, or inject unauthorized admin authentication approvals, enabling unauthorized access to administrative functions.",
                  "mitigation": "Implement cryptographic message authentication codes (HMAC) at the application layer\n\nImplement certificate pinning (without hardware-backed PKI or strict fail-closed, unless supported by your environment)",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 190,
                  "score": ""
                },
                {
                  "id": "8de26a34-9cd7-43af-b433-9819792bd316",
                  "title": "Admin Credential Exposure via Network Sniffing",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Auth Service and Admin Database to extract admin credentials, role mappings, MFA secrets, or privilege information. Exposed admin authentication data enables targeted attacks against high-privilege accounts, potentially compromising the entire system.",
                  "mitigation": "Enforce TLS 1.3 with perfect forward secrecy for all admin database connections\n\nDeploy host-based intrusion detection (HIDS) on database servers",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 191,
                  "score": ""
                },
                {
                  "id": "df25fc51-6bac-464f-b63c-e09ded24e48a",
                  "title": "Network Disruption of Admin Authentication Channel",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers target the network path between Auth Service and Admin Database with flooding attacks, connection exhaustion, or bandwidth saturation to prevent admin authentication. This is especially critical during security incidents when rapid administrative response is required.",
                  "mitigation": "Configure aggressive connection limits with IP allowlisting for admin database access",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 192,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 3,
                "informationDisclosure": 2,
                "denialOfService": 2
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-authservice-admindb-1",
            "source": {
              "cell": "auth-service"
            },
            "target": {
              "cell": "admin-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Auth Service Audit Log",
              "description": "Authentication events logging",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "97a7150b-e4e2-449d-8a05-333269232df6",
                  "title": "Authentication Log Tampering During Transmission",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept authentication event logs in transit between Auth Service and Audit Log Database, modifying or dropping log entries to hide malicious activity. Tampered logs prevent detection of brute force attacks, unauthorized access attempts, or credential compromise.",
                  "mitigation": "Enforce TLS 1.3 encryption for all log transmission\n\nImplement cryptographic hash chains linking log entries at source\n\nUse message authentication codes (HMAC) for each log entry\n\nImplement log sequence numbers to detect dropped entries",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 196,
                  "score": ""
                },
                {
                  "id": "732edff5-7110-43ad-abb0-565e5ab4a2c2",
                  "title": "Authentication Log Data Exposure During Transmission",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Attackers capture authentication log traffic between Auth Service and Audit Log Database to extract sensitive information including usernames, IP addresses, authentication patterns, failed login attempts, and user behavior. Exposed logs aid password guessing, user enumeration, or pattern analysis attacks.",
                  "mitigation": "Enforce TLS 1.3 encryption for all log transmission\n\nImplement log pseudonymization at source for sensitive identifiers\n\nUse field-level encryption for usernames and IPs in logs\n\nUse log data minimization, only transmit necessary fields",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 197,
                  "score": ""
                },
                {
                  "id": "4345d37b-1fd9-4eec-b08b-44170fe1e7dd",
                  "title": "Authentication Log Pipeline Network Saturation",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers generate massive authentication event volumes (brute force attacks) to overwhelm the network path between Auth Service and Audit Log Database, saturating bandwidth or exhausting log collection capacity. Log drops create audit gaps and compliance violations.",
                  "mitigation": "Implement log buffering with guaranteed delivery (using simple message queues like RabbitMQ, Kafka, or even local queues)\n\nImplement log aggregation and sampling for high-volume events\n\nUse log compression to reduce network bandwidth consumption\n\nImplement circuit breakers to prevent log pipeline saturation",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 198,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-authservice-auditlog",
            "source": {
              "cell": "auth-service"
            },
            "target": {
              "cell": "audit-log-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Customer Data Write",
              "description": "Write/update customer profile data",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "f50ee473-134b-43b1-9c6e-294fd1a10699",
                  "title": "Man-in-the-Middle Modification of Customer Data Queries",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept the communication channel between Customer Service and Customer Database to modify customer profile queries or data responses in transit. Tampered packets could alter which customer's data is retrieved, modify returned profile information, or inject false data into customer records.",
                  "mitigation": "Enforce TLS 1.3 encryption for database connections\n\nImplement application-layer integrity checks (HMAC) on critical data fields\n\nUse checksums or digital signatures for data exchanged between service and database\n\nUse request/response signing with cryptographic verification",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 199,
                  "score": ""
                },
                {
                  "id": "9fc44daf-a553-4b45-9478-6748c72b563b",
                  "title": "Customer PII Interception During Network Transmission",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Customer Service and Customer Database to extract customer personally identifiable information (PII) including names, addresses, emails, phone numbers, and account details. Unencrypted or weakly encrypted connections expose sensitive customer data to network sniffing.",
                  "mitigation": "Enforce TLS 1.3 encryption with strong cipher suites for all customer database connections\n\nEnable perfect forward secrecy (PFS) cipher suites",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 200,
                  "score": ""
                },
                {
                  "id": "29192a70-09b5-495d-906e-d6d47380cfed",
                  "title": "Network Flooding of Customer Database Connections",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers flood the network path between Customer Service and Customer Database with excessive traffic, saturating network bandwidth or overwhelming database connection capacity. This prevents legitimate customer profile operations, degrading user experience.",
                  "mitigation": "Use connection pooling at the service layer with circuit breakers\n\nConfigure network firewall rules restricting database access by IP",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 201,
                  "score": ""
                },
                {
                  "id": "8644cb45-7f4b-405a-beb0-21bc6fe01010",
                  "title": "Response Data Manipulation on Return Path",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Attackers intercept database response traffic returning customer data to Customer Service, modifying profile information, account balances, or account status in transit. The service processes tampered data, leading to incorrect business logic decisions.",
                  "mitigation": "Enforce TLS encryption protecting request and response paths\n\nImplement application-layer response validation with integrity checks\n\nUse HMAC verification on critical response data fields\n\nUse checksums for sensitive data fields in responses",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 202,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 2,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customerdb-customerservice-write",
            "source": {
              "cell": "customer-db"
            },
            "target": {
              "cell": "customer-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Customer Service Audit Log",
              "description": "Customer service events logging",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "c272aef2-9ca4-418e-ae79-994d4f756c90",
                  "title": "Customer Activity Log Tampering During Transmission",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept customer service event logs in transit, modifying or dropping log entries to hide unauthorized data access, profile modifications, or suspicious activity patterns. Tampered logs prevent incident detection and investigation.\n",
                  "mitigation": "Enforce TLS 1.3 encryption for log transmission\n\nImplement cryptographic signing of log entries at source\n\nUse hash-chain linking for log sequence integrity\n\nImplement log sequence validation to detect gaps\n\nUse immutable log transmission to prevent in-flight modifications",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 203,
                  "score": ""
                },
                {
                  "id": "9e9aa2fc-fcff-4559-b23f-c86cbb4ddb8d",
                  "title": "Customer Activity Log Exposure During Transmission",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Information disclosure",
                  "description": "Attackers capture customer service log traffic to extract customer PII, access patterns, service usage data, or behavioral information. Exposed logs violate privacy regulations and reveal sensitive customer behavior.",
                  "mitigation": "Enforce TLS 1.3 encryption for all log transmission\n\nImplement log data minimization, avoid logging PII where possible\n\nUse pseudonymization for customer identifiers in logs\n\nImplement field-level encryption for sensitive log fields\n\nUse secure log forwarding protocols (e.g., syslog-ng TLS, Fluentd secure forward)",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 204,
                  "score": ""
                },
                {
                  "id": "124eb9b1-b82e-47da-8fe4-aea893dc1425",
                  "title": "Customer Service Log Pipeline Network Overload",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "High-volume customer service operations or automated attacks generate excessive log traffic, saturating the network path to Audit Log Database. Log drops create audit gaps and compliance violations.",
                  "mitigation": "Implement log buffering with message queues (Kafka, RabbitMQ, or even lightweight local queues)\n\nUse log aggregation for repetitive events\n\nImplement log sampling for non-critical high-volume events\n\nUse log compression to reduce bandwidth consumption",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 205,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customerservice-auditlog",
            "source": {
              "cell": "customer-service"
            },
            "target": {
              "cell": "audit-log-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Service Audit Log",
              "description": "Order service events logging",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "027bb185-70e2-492c-9064-e39fe7235bf3",
                  "title": "Order Transaction Log Tampering During Transmission",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept order transaction logs in transit, modifying or dropping log entries to hide fraudulent orders, price manipulation, or unauthorized order modifications. Tampered logs prevent fraud detection and financial auditing.",
                  "mitigation": "Enforce TLS 1.3 encryption for log transmission\n\nImplement digital signatures on financial transaction logs\n\nImplement cryptographic hash chains for log integrity\n\nUse write-once or append-only storage for financial logs",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 206,
                  "score": ""
                },
                {
                  "id": "6a548cd0-febc-4f2f-8ceb-6ec30d93439b",
                  "title": "Order Transaction Log Exposure During Transmission",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Attackers capture order transaction logs to extract sensitive financial information including order totals, payment methods, customer purchase patterns, or revenue data. Exposed logs violate PCI DSS and enable financial fraud.",
                  "mitigation": "Enforce TLS 1.3 encryption for all financial log transmission\n\nImplement tokenization of payment references in logs\n\nUse PII masking for customer identifiers in transaction logs\n\nImplement field-level encryption for sensitive financial data",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 207,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 2,
                "informationDisclosure": 1,
                "denialOfService": 0
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-orderservice-auditlog",
            "source": {
              "cell": "order-service"
            },
            "target": {
              "cell": "audit-log-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Customer Response",
              "description": "Customer data response for order",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "991d37c6-8fbc-4010-914b-8c713b642ace",
                  "title": "Man-in-the-Middle Attack on Customer Verification Traffic",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept customer verification queries during order processing, modifying customer lookup parameters or verification responses. Tampered packets could enable orders under false customer identities, bypass customer validation checks, or access unauthorized customer data.",
                  "mitigation": "Enforce TLS 1.3 encryption for database connections\n\nImplement request/response integrity verification using HMAC\n\nImplement application-layer validation of customer verification responses",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 208,
                  "score": ""
                },
                {
                  "id": "755b5129-0f0f-4a70-9c93-518f532c23fe",
                  "title": "Customer Data Leakage During Order Validation",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Order Service and Customer Database during order validation to extract customer contact information, payment method references, or account details. This data enables fraud, identity theft, or social engineering attacks.",
                  "mitigation": "Enforce TLS 1.3 encryption for all order service database connections\n\nUse field-level encryption for sensitive customer fields at the application layer\n\nUse query result filtering to minimize data transmitted over the network",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 209,
                  "score": ""
                },
                {
                  "id": "4a516c32-eb01-42e9-a368-244a22caf2c8",
                  "title": "Network Disruption of Order Customer Validation",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers flood the network path between Order Service and Customer Database during high-volume order processing, saturating bandwidth or exhausting connections. This prevents customer validation queries from completing, blocking order placement and impacting revenue.",
                  "mitigation": "Implement connection pooling with circuit breakers",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 210,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-customerdb-orderservice-write",
            "source": {
              "cell": "customer-db"
            },
            "target": {
              "cell": "order-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Customer Query",
              "description": "Query customer data for order validation",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "929c2023-b207-46f5-8590-397293f4fe6a",
                  "title": "Customer Validation Response Manipulation",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept customer validation responses returning to Order Service, modifying customer approval status, shipping addresses, or eligibility flags. Tampered responses enable fraudulent orders, incorrect deliveries, or bypassed business rules.",
                  "mitigation": "Enforce TLS encryption for bidirectional traffic\n\nImplement cryptographic signing of validation responses at the database layer\n\nUse HMAC verification on critical validation result fields\n\nImplement application-layer validation of response data consistency",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 211,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 0,
                "denialOfService": 0
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-orderservice-customerdb-read",
            "source": {
              "cell": "order-service"
            },
            "target": {
              "cell": "customer-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Product Response",
              "description": "Product data response for order",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "d6a51625-5664-4f94-9382-2a222b2f2632",
                  "title": "Man-in-the-Middle Attack on Product Pricing Queries",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept product pricing and availability queries between Order Service and Product Database, modifying product prices, stock levels, or product IDs in transit. Tampered packets enable fraudulent purchases at incorrect prices, ordering of unavailable items, or price manipulation fraud.",
                  "mitigation": "Enforce TLS 1.3 encryption for product database connections\n\nImplement cryptographic signing of price data at the database layer\n\nUse HMAC verification for critical pricing fields\n\nImplement dual-verification comparing network-received prices with cached values\n\nImplement transaction rollback on detected price tampering",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 212,
                  "score": ""
                },
                {
                  "id": "0228e300-a761-48cc-9f53-6e2a90101339",
                  "title": "Product Pricing and Inventory Intelligence Exposure",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Information disclosure",
                  "description": "Attackers capture product database traffic to extract competitive intelligence including pricing strategies, inventory levels, cost structures, or product availability patterns. Exposed data advantages competitors or enables targeted price manipulation.\n",
                  "mitigation": "Enforce TLS 1.3 encryption for all product database connections\n\nImplement query result pagination to limit data per network transmission",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 213,
                  "score": ""
                },
                {
                  "id": "8600a813-9639-456f-95b9-9a72c817bcb6",
                  "title": "Network Flooding of Product Availability Queries",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers flood the network path between Order Service and Product Database with excessive product lookup requests, saturating bandwidth or overwhelming database connections. This prevents legitimate product availability checks, halting order processing pipeline.",
                  "mitigation": "Use connection pooling with maximum limits and circuit breakers\n\nImplement caching to reduce network traffic to the product database",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 214,
                  "score": ""
                },
                {
                  "id": "aa86c39c-5d3f-48af-8f3a-a96bc6ce8a29",
                  "title": "Product Data Response Manipulation During Order Creation",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept product price and availability responses, modifying product data before it reaches Order Service. Tampered responses enable orders at fraudulent prices, bypass stock validation, or manipulate order totals.",
                  "mitigation": "Enforce TLS encryption with strict certificate validation\n\nImplement cryptographic signing of product responses at the database layer\n\nUse HMAC verification on price, inventory, and product ID fields\n\nDeploy application-layer validation comparing prices with cached data\n\nEnable transaction validation with price range checks",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 215,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 2,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-productdb-orderservice-write",
            "source": {
              "cell": "product-db"
            },
            "target": {
              "cell": "order-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Order Read",
              "description": "Read order history and status",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "e580525e-c9fd-4c47-9ed3-ecafd6490da4",
                  "title": "Man-in-the-Middle Attack on Order Transaction Data",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept order creation or modification traffic between Order Service and Order Database, tampering with order amounts, quantities, payment status, or shipping addresses during transmission. Modified packets enable financial fraud, logistics disruption, or order manipulation.\n",
                  "mitigation": "Enforce TLS 1.3 encryption for all order database connections\n\nImplement application-layer transaction signing with cryptographic verification\n\nUse HMAC validation on critical order fields (total, status, address)\n\nImplement end-to-end integrity verification from service to database\n\nImplement transaction validation comparing transmitted vs stored values",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 216,
                  "score": ""
                },
                {
                  "id": "a62cb659-80b1-49c5-ad83-b7c0c7d83e81",
                  "title": "Order Transaction Data Interception During Transmission",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Order Service and Order Database to extract sensitive order information including customer purchases, order values, payment references, and purchase patterns. Exposure enables fraud, privacy violations, or competitive intelligence gathering.\n",
                  "mitigation": "Enforce TLS 1.3 encryption with perfect forward secrecy for all order database connections\n\nImplement field-level encryption at the application layer for sensitive order fields",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 217,
                  "score": ""
                },
                {
                  "id": "5f4f91ae-b3d0-4632-b133-8da91aaa2aaa",
                  "title": "Network Saturation of Order Processing Pipeline",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers flood the network path between Order Service and Order Database with excessive traffic, saturating bandwidth or overwhelming database connections during peak order processing. This prevents legitimate orders from being processed, directly impacting revenue and customer satisfaction.",
                  "mitigation": "Implement connection pooling with circuit breakers and failover",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 218,
                  "score": ""
                },
                {
                  "id": "fb6829dc-257f-4125-a7fa-8520d9cf8130",
                  "title": "Order Confirmation Response Manipulation",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept order confirmation responses from Order Database to Order Service, modifying order status, payment confirmation, or order details in transit. Tampered responses cause incorrect order processing, false payment confirmations, or logistics errors.\n",
                  "mitigation": "Enforce TLS encryption protecting bidirectional order traffic\n\nImplement cryptographic signing of order confirmations at the database layer\n\nUse HMAC verification on critical order status fields\n\nUse transaction reconciliation to detect tampered confirmations",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 219,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 2,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-orderdb-orderservice-write",
            "source": {
              "cell": "order-db"
            },
            "target": {
              "cell": "order-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Product Response",
              "description": "Product catalog data response",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "1553ece3-fbe6-4a84-9039-17ccf85e23f0",
                  "title": "Man-in-the-Middle Attack on Product Catalog Traffic",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept product catalog queries or updates between Product Service and Product Database, modifying product data, prices, inventory levels, or product metadata in transit. Tampered packets enable price manipulation, inventory corruption, or catalog sabotage.\n",
                  "mitigation": "Enforce TLS 1.3 encryption with mutual authentication for product database connections\n\nImplement application-layer integrity checks on product update transactions\n\nUse cryptographic signing of product modifications at the service layer\n\nImplement change validation comparing transmitted vs cached product data\n\nEnable transaction rollback on detected tampering\n\nUse HMAC verification for critical product fields (price, inventory)",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 220,
                  "score": ""
                },
                {
                  "id": "c679674e-7024-4dd6-a0a4-8a80de976372",
                  "title": "Product Business Intelligence Leakage via Network Capture",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Product Service and Product Database to extract sensitive product information including cost structures, supplier data, profit margins, pricing strategies, or inventory levels. Exposed data provides competitive intelligence or enables market manipulation.",
                  "mitigation": "Enforce TLS 1.3 encryption for all product database connections\n\nImplement column-level encryption for sensitive product fields at the application layer",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 221,
                  "score": ""
                },
                {
                  "id": "a4506d9f-c4bf-4dae-a4a5-1fb5237caffa",
                  "title": "Network Flooding of Product Catalog Operations",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers flood the network path between Product Service and Product Database with excessive catalog queries or update requests, saturating bandwidth or overwhelming database connections. This prevents legitimate product browsing and catalog management, impacting sales.\n",
                  "mitigation": "Implement connection pooling with circuit breakers\n\nImplement caching to reduce database traffic",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 222,
                  "score": ""
                },
                {
                  "id": "b3ccaa0c-f946-4b6a-b58f-fd650ebb43a5",
                  "title": "Product Response Data Manipulation During Retrieval",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept product catalog responses from Product Database to Product Service, modifying product prices, descriptions, availability status, or images in transit. Tampered responses cause incorrect product display, pricing errors, or business logic failures.\n",
                  "mitigation": "Enforce TLS encryption with strict certificate validation\n\nImplement cryptographic signing of product responses at the database layer\n\nUse HMAC verification on critical product fields\n\nDeploy application-layer validation of product data consistency\n\nUse checksums for product data fields in responses",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 223,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 2,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-productdb-productservice-write",
            "source": {
              "cell": "product-db"
            },
            "target": {
              "cell": "product-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Data Write",
              "description": "Write/update admin user data",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "f32da07e-3fff-4448-bedf-7fb884010e77",
                  "title": "Man-in-the-Middle Attack on Administrative Traffic",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept administrative operations between Admin Service and Admin Database, modifying privilege assignments, role updates, or admin account modifications in transit. Tampered packets enable unauthorized privilege escalation, backdoor account creation, or security policy bypass.",
                  "mitigation": "Enforce TLS encryption for admin database connections\n\nImplement cryptographic signing of administrative transactions\n\nUse out-of-band verification for critical privilege changes",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 224,
                  "score": ""
                },
                {
                  "id": "f6d36531-0a1a-44e5-9967-31d0505c7cf4",
                  "title": " Administrative Credential and Permission Exposure",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Admin Service and Admin Database to extract admin credentials, role mappings, permission policies, MFA configurations, or privilege levels. Exposed administrative data enables targeted attacks against high-privilege accounts, potentially compromising the entire system.",
                  "mitigation": "Enforce TLS 1.3 encryption with perfect forward secrecy and mutual authentication",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 225,
                  "score": ""
                },
                {
                  "id": "92ec658c-502b-4388-a103-131e7b649468",
                  "title": "Network Disruption of Administrative Functions",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers target the network path between Admin Service and Admin Database with DDoS attacks, connection flooding, or bandwidth saturation to prevent administrative operations. This is critical during security incidents requiring rapid admin response for incident containment.",
                  "mitigation": "Implement strict rate limiting and IP allowlisting for admin operations, place the Admin Service behind a simple VPN (e.g., WireGuard), and use circuit breakers to fail fast during overloads. During network saturation, allow emergency admin actions to be queued locally and applied once connectivity restores. Basic firewall rules can temporarily isolate malicious traffic.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 226,
                  "score": ""
                },
                {
                  "id": "8915ab02-e3c5-4f33-8518-255265ea8e02",
                  "title": "Admin Authentication Response Manipulation",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept admin authentication or permission verification responses from Admin Database to Admin Service, modifying privilege grants, authentication success status, or role assignments in transit. Tampered responses enable unauthorized admin access or privilege escalation.",
                  "mitigation": "Enforce TLS encryption for admin authentication traffic\n\nImplement cryptographic signing of all admin responses at the database layer\n\nDeploy challenge-response mechanisms to prevent replay attacks\n\nImplement out-of-band confirmation for high-privilege operations",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 227,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 2,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-admindb-adminservice-write",
            "source": {
              "cell": "admin-db"
            },
            "target": {
              "cell": "admin-service"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Order View",
              "description": "Admin view of order database",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "6c2bf23b-89a3-487a-8cb3-c7254c5274ff",
                  "title": "Man-in-the-Middle Attack on Admin Order Operations",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept administrative order management traffic between Admin Service and Order Database, modifying order status changes, refund amounts, or order data alterations in transit. Tampered packets enable financial fraud through unauthorized refunds or order manipulation.",
                  "mitigation": "Enforce TLS 1.3 encryption with mutual authentication for admin order database access\n\nImplement multi-admin approval workflows at the application layer for high-value changes\n\nUse cryptographic signing of admin order transactions\n\nImplement transaction integrity verification comparing transmitted vs committed data\n\nUse HMAC verification on critical order modification fields",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 228,
                  "score": ""
                },
                {
                  "id": "6eec8fee-0b0e-4e59-abd3-a375a2c45d41",
                  "title": "Order Data Exposure During Admin Access",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Admin Service and Order Database during administrative operations to extract bulk order data, customer purchase patterns, financial transactions, or business analytics. Exposed data could be sold, leaked, or used for fraud.",
                  "mitigation": "Enforce TLS 1.3 encryption for all admin database connections\n\nImplement data masking for PII in admin query results at the application layer\n\nUse query result limits to prevent large data transfers\n\nImplement access logging with alerting on unusual admin query patterns",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 229,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 0
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-adminservice-orderdb",
            "source": {
              "cell": "admin-service"
            },
            "target": {
              "cell": "order-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Product View",
              "description": "Admin view of product database",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "dcc3f6fc-0868-42da-ae0b-c2fc6c49ddc7",
                  "title": "Man-in-the-Middle Attack on Product Admin Operations",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept product catalog administration traffic between Admin Service and Product Database, modifying product prices, inventory levels, or product data in transit. Tampered packets enable price manipulation fraud, inventory corruption, or competitive sabotage.",
                  "mitigation": "Enforce TLS 1.3 encryption for admin product database access\n\nImplement multi-admin approval for critical price changes at the application layer\n\nUse cryptographic signing of product modification transactions\n\nImplement change validation with price range checks\n\nEnable transaction rollback on detected tampering\n\nUse HMAC verification on critical product fields",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 230,
                  "score": ""
                },
                {
                  "id": "44ff66b5-011b-4fe3-9687-b45b91ebdac7",
                  "title": "Product Intelligence Exposure During Admin Access",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Information disclosure",
                  "description": "Attackers capture network traffic between Admin Service and Product Database during administrative operations to extract sensitive product data including cost structures, supplier information, profit margins, or upcoming product launches. Exposed data benefits competitors or enables insider trading.",
                  "mitigation": "Enforce TLS 1.3 encryption for all admin product database connections\n\nImplement column-level encryption for sensitive product fields at the application layer\n\nUse data masking for cost/margin data in admin interfaces\n\nImplement access logging with alerting on sensitive data queries",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 231,
                  "score": ""
                },
                {
                  "id": "e9b64c58-02f5-45ea-bd9f-00ced9e2d64b",
                  "title": "Network Saturation from Bulk Product Operations",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Large admin operations such as bulk product imports, inventory synchronization, or catalog exports saturate the network path between Admin Service and Product Database, impacting customer-facing product browsing operations.",
                  "mitigation": "Implement scheduled off-peak execution for bulk admin operations\n\nImplement asynchronous job processing for bulk operations",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 232,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-adminservice-productdb",
            "source": {
              "cell": "admin-service"
            },
            "target": {
              "cell": "product-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Product Service Audit Log",
              "description": "Product service events logging",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "e13439e7-42a0-4089-aa96-f633e94aff6b",
                  "title": "Product Modification Log Tampering During Transmission",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Network attackers intercept product change logs in transit, modifying or dropping log entries to hide unauthorized price changes, inventory manipulation, or catalog tampering. Tampered logs prevent detection of insider fraud or competitive sabotage.",
                  "mitigation": "Enforce TLS 1.3 encryption with mutual authentication for log transmission\n\nImplement cryptographic signing of product change logs\n\nUse hash-chain integrity (e.g., each log entry includes the hash of the previous one)\n\nDeploy redundant log forwarding to an independent log collector or backup service\n\nImplement change detection by comparing logs with periodic database snapshots\n\nEnable real-time monitoring for suspicious or anomalous product change logs\n\nUse immutable log storage (append-only, write-once) at the destination",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 233,
                  "score": ""
                },
                {
                  "id": "f1c2f4ff-1cd4-45d1-808b-395b7cc071f2",
                  "title": "Product Business Intelligence Leakage via Logs",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Information disclosure",
                  "description": "Attackers capture product service logs to extract sensitive business intelligence including pricing strategies, inventory management patterns, product performance data, or supplier information. Exposed logs benefit competitors.",
                  "mitigation": "Enforce TLS 1.3 encryption for all product log transmissions\n\nImplement log data minimization to avoid capturing unnecessary or sensitive business information\n\nUse data masking to protect sensitive product fields in logs (e.g., supplier cost, margins)\n\nDeploy network segmentation to isolate product log traffic from other internal networks\n\nImplement strict access controls (RBAC) on log collectors and log viewing systems\n\nEnable network DLP monitoring to detect leakage of sensitive product-related log data",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 234,
                  "score": ""
                },
                {
                  "id": "87c3e32b-464f-47aa-87e0-cfa89bc8084d",
                  "title": "Product Service Log Pipeline Network Overload",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Bulk product operations (imports, synchronization) generate excessive log traffic, saturating the network path to Audit Log Database. Log drops create audit gaps for product catalog changes.",
                  "mitigation": "Implement log aggregation to consolidate and optimize large-volume product log streams\n\nUse log sampling to reduce repetitive or high-frequency product event logs\n\nDeploy network bandwidth management to prevent log traffic from congesting the network\n\nImplement log buffering with asynchronous log processing to avoid blocking product services\n\nUse log compression to reduce network usage during log transmission\n\nEnable scheduled off-peak logging for bulk or batch product operations",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 235,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-productservice-auditlog",
            "source": {
              "cell": "product-service"
            },
            "target": {
              "cell": "audit-log-db"
            }
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "targetMarker": {
                  "name": "block"
                },
                "sourceMarker": {
                  "name": ""
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Admin Service Audit Log",
              "description": "Admin service events logging",
              "outOfScope": false,
              "isTrustBoundary": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isBidirectional": false,
              "isEncrypted": false,
              "isPublicNetwork": false,
              "protocol": "",
              "threats": [
                {
                  "id": "0caf246c-ff1e-4c21-9706-ec280cd044b2",
                  "title": "Administrative Action Log Tampering During Transmission",
                  "status": "Open",
                  "severity": "Critical",
                  "type": "Tampering",
                  "description": "Network attackers intercept administrative action logs in transit, modifying or dropping log entries to hide privilege escalations, unauthorized system changes, security control bypasses, or incident response actions. Tampered logs undermine the entire security audit framework and prevent incident investigation.",
                  "mitigation": "Enforce TLS 1.3 for log transmission\n\nUse hashing to ensure log integrity\n\nStore logs in a separate audit log database\n\nEnable RBAC to restrict log access\n\nPerform automatic daily backups of logs\n\nAdd alerts for suspicious log patterns",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 236,
                  "score": ""
                },
                {
                  "id": "7c03a3bc-137d-4a6a-abb3-60481fcbc417",
                  "title": "Administrative Action Intelligence Exposure During Transmission",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Attackers capture administrative audit log traffic to extract highly sensitive system intelligence including security architecture, vulnerability remediation actions, incident response procedures, privileged account activity, or system configuration changes. Exposed logs enable targeted attacks exploiting revealed weaknesses.",
                  "mitigation": "Enforce TLS 1.3 with mTLS\n\nStore logs in an append-only audit database\n\nAdd SHA-256 hashes for log integrity\n\nUse RBAC to restrict log access\n\nMask sensitive identifiers (pseudonymization)\n\nAdd alerts for unusual log access or export\n\nPlace logs in a separate subnet/VPC",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 237,
                  "score": ""
                },
                {
                  "id": "f4374cd1-a398-43a2-8491-84df4dc565c8",
                  "title": "Administrative Audit Log Pipeline Network Disruption",
                  "status": "Open",
                  "severity": "High",
                  "type": "Denial of service",
                  "description": "Attackers target the network path between Admin Service and Audit Log Database with DDoS attacks to prevent administrative action logging during security incidents or malicious operations. Lost admin logs create critical forensic gaps and compliance violations, especially during active attacks.",
                  "mitigation": "Enforce TLS 1.3 for admin log traffic\n\nImplement local buffering to retain logs during network slowdowns\n\nUse asynchronous log forwarding with retries\n\nConfigure rate limiting and connection throttling to resist flooding\n\nDeploy basic DDoS protection on the admin endpoints\n\nForward logs to a secondary backup collector if the primary is unreachable\n\nUse circuit breakers to isolate failing log paths\n\nEnable monitoring + alerts for log delivery delays or network congestion\n\nApply log compression to reduce bandwidth consumption",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 238,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            },
            "labels": [
              {
                "attrs": {
                  "label": {
                    "text": "Data Flow"
                  }
                }
              }
            ],
            "id": "flow-adminservice-auditlog",
            "source": {
              "cell": "admin-service"
            },
            "target": {
              "cell": "audit-log-db"
            }
          },
          {
            "position": {
              "x": 1080,
              "y": 720
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Product Database"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "topline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              },
              "bottomline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "store",
            "zIndex": 11,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "98c9b83c-a5fc-4e79-8c80-693baea7ae85"
                },
                {
                  "group": "right",
                  "id": "91979fbf-2dd0-41a6-8a49-328974530153"
                },
                {
                  "group": "bottom",
                  "id": "c077afb7-cfde-449d-af8b-24d58ffe7180"
                },
                {
                  "group": "left",
                  "id": "9b1e6a90-5de7-4407-a99f-1206f7ca9e33"
                }
              ]
            },
            "id": "product-db",
            "data": {
              "type": "tm.Store",
              "name": "Product Database",
              "description": "Stores product catalog, pricing, and inventory data",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isALog": false,
              "isEncrypted": false,
              "isSigned": false,
              "storesCredentials": false,
              "storesInventory": true,
              "threats": [
                {
                  "id": "bbfa425e-755e-4d4d-97ab-6651d0ab6bbd",
                  "title": "Product Database Tampering: Unauthorized Modification of Product Records",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Attackers or malicious insiders could alter product information such as prices, inventory quantities, discounts, or product metadata by exploiting insecure APIs, weak database permissions, or unvalidated input. This may result in financial loss, fraudulent purchases, or disruption of business operations.",
                  "mitigation": "Enforce strict access control and least-privilege database permissions.\n\nUse server-side input validation and parameterized queries to prevent injection attacks.\n\nApply integrity checks and verify product updates at the application layer.\n\nRecord all product modifications in tamper-resistant audit logs.\n\nMonitor for anomalous update patterns across product tables.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 149,
                  "score": ""
                },
                {
                  "id": "43d4fb75-10fc-49f4-bc8d-1808408b6caf",
                  "title": "Product Database Repudiation : Inability to Attribute Product Data Changes",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "If product update actions are not recorded securely, a admin could deny making changes to product pricing, stock levels, or descriptions. Lack of accountability complicates incident response and compliance requirements.",
                  "mitigation": "Use append-only audit logs to record all product modifications.\n\nApply digital signatures or hashing to ensure log integrity.\n\nInclude timestamps, user IDs, and request metadata for every update.\n\nPeriodically verify log consistency to ensure no unauthorized modifications.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 150,
                  "score": ""
                },
                {
                  "id": "7125beb3-7d53-4e3b-be61-ee6e56dad5b5",
                  "title": "Product Database Information Disclosure: Unauthorized Access to Product Data",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Unauthorized users may gain access to product metadata, pricing strategies, stock quantities, or unpublished items. This exposure can enable competitors, scrapers, or attackers to exploit internal business data or prepare targeted fraud.",
                  "mitigation": "Enforce role-based access control with granular read permissions.\n\nEncrypt sensitive product data at rest and in transit.\n\nIsolate the Product Database behind restricted network boundaries.\n\nMonitor and alert on unusual read patterns or bulk data extraction attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 151,
                  "score": ""
                },
                {
                  "id": "6197f609-e7ad-4aca-87ff-24b4dd58405c",
                  "title": "Product Database Denial of Service: Disruption of Product Data Availability",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may overload the Product Database by sending excessive read/write requests, triggering expensive queries, or exploiting locking mechanisms. This can degrade performance or prevent legitimate product retrieval and updates.",
                  "mitigation": "Implement rate limiting and connection throttling for API and DB access.\n\nOptimize and index product-related queries to reduce resource usage.\n\nUse replication, failover, and caching to maintain availability.\n\nContinuously monitor DB performance and detect unusual load patterns.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 152,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "repudiation": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            }
          },
          {
            "position": {
              "x": 1050,
              "y": 930
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Order Database"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "topline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              },
              "bottomline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "store",
            "zIndex": 12,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "0c697b61-6a21-4fcd-9c51-9216bf58ef40"
                },
                {
                  "group": "right",
                  "id": "7bffbb19-cf62-49fd-8d4f-d65bffaedb88"
                },
                {
                  "group": "bottom",
                  "id": "b355dad8-c3a4-44c3-afaa-3f371d81105c"
                },
                {
                  "group": "left",
                  "id": "410eda6e-38dc-4d64-b453-6acb0e45f099"
                }
              ]
            },
            "id": "order-db",
            "data": {
              "type": "tm.Store",
              "name": "Order Database",
              "description": "Stores order transactions and order history",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isALog": false,
              "isEncrypted": false,
              "isSigned": false,
              "storesCredentials": false,
              "storesInventory": false,
              "threats": [
                {
                  "id": "bdee879f-e4c1-42f7-baea-1b50d9dad6e3",
                  "title": "Order Database Tampering: Unauthorized Manipulation of Order Records",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Attackers or malicious insiders could alter order details such as item quantities, pricing totals, delivery information, or order status by exploiting insecure APIs, weak database permissions, or injection vulnerabilities. Such manipulation may enable fraudulent purchases, financial loss, incorrect deliveries, or disruption of order workflows.",
                  "mitigation": "Enforce strict access control and least-privilege DB permissions.\n\nUse input validation, sanitization, and parameterized queries to mitigate injection risks.\n\nImplement ownership checks to ensure users can only modify their own orders.\n\nApply integrity checks on order updates at the application layer.\n\nRecord all order changes in tamper-resistant audit logs and monitor suspicious activity.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 153,
                  "score": ""
                },
                {
                  "id": "5861a520-5435-4d02-80c8-8aff48d62b39",
                  "title": "Order Database Repudiation: Inability to Attribute Order Creation or Modification",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Repudiation",
                  "description": "Without secure, immutable logging, users or attackers could deny placing, modifying, or canceling orders. This undermines accountability, complicates dispute resolution, and impacts legal or financial traceability.",
                  "mitigation": "Maintain append-only, tamper-proof audit logs for all order events.\n\nUse digital signatures, hashes, and sequence numbers to prevent log manipulation.\n\nStore timestamps, user identifiers, and request metadata for every order-related action.\n\nPeriodically validate audit log integrity to detect unauthorized changes.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 154,
                  "score": ""
                },
                {
                  "id": "b8e6e5db-a9b8-4119-8b84-7d5821003fc2",
                  "title": "Order Database Information Disclosure: Exposure of Sensitive Order and Customer Information",
                  "status": "Open",
                  "severity": "High",
                  "type": "Information disclosure",
                  "description": "Unauthorized access to the Order Database could reveal customer order histories, payment metadata (non-PCI scoped fields), and purchase patterns. Such exposure may lead to privacy violations, targeted fraud, or social engineering attacks.",
                  "mitigation": "Enforce role-based access control and restrict read permissions to authorized services only.\n\nEncrypt sensitive order data at rest and in transit.\n\nPlace the Order Database in a restricted network segment with no public exposure.\n\nMonitor for anomalous or bulk read patterns, and alert on suspicious queries.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 155,
                  "score": ""
                },
                {
                  "id": "21109845-ffff-4e2c-bf16-84926484cb79",
                  "title": "Order Database Denial of Service: Disruption of Order Data Availability",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "Attackers may intentionally overload the database by generating excessive read/write operations, triggering long-running queries, or exploiting DB locking mechanisms. This can degrade performance or make order creation, updates, and retrieval unavailable, halting the order processing pipeline.",
                  "mitigation": "Implement rate limiting and throttle excessive API-to-DB operations.\n\nConfigure connection pooling to protect DB resources.\n\nUse replication, caching, and automated failover for high availability.\n\nContinuously monitor database load, latency, and lock patterns to detect abnormalities.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 156,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "repudiation": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            }
          },
          {
            "position": {
              "x": 1240,
              "y": 450
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Audit Log Database"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 2.5,
                "strokeDasharray": null
              },
              "topline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              },
              "bottomline": {
                "stroke": "#333333",
                "strokeWidth": 1.5,
                "strokeDasharray": null
              }
            },
            "visible": true,
            "shape": "store",
            "zIndex": 13,
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "f1cd0957-0530-49bb-9c6d-546dd53b6917"
                },
                {
                  "group": "right",
                  "id": "9b27eb62-f3b4-450f-b19f-0e639f2fc5bd"
                },
                {
                  "group": "bottom",
                  "id": "cf59801d-4dd5-4707-8d9c-66e31e7dec2b"
                },
                {
                  "group": "left",
                  "id": "75238033-8c4c-4f94-a30f-867ef7b4f8e9"
                }
              ]
            },
            "id": "audit-log-db",
            "data": {
              "type": "tm.Store",
              "name": "Audit Log Database",
              "description": "Stores audit logs from all services for security and compliance",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "hasOpenThreats": true,
              "isALog": true,
              "isEncrypted": false,
              "isSigned": false,
              "storesCredentials": false,
              "storesInventory": false,
              "threats": [
                {
                  "id": "49628556-6d24-495f-8940-4bcb65f474e8",
                  "title": "Audit Log Database Tampering: Unauthorized Modification of Audit Log Records",
                  "status": "Open",
                  "severity": "High",
                  "type": "Tampering",
                  "description": "Attackers or malicious insiders may attempt to alter, delete, or overwrite audit log entries to hide malicious activity, unauthorized access, or system misuse. Tampered logs undermine traceability, make forensic investigation impossible, and compromise the overall security posture.",
                  "mitigation": "Store logs in append-only, tamper-evident storage\n\nEnforce strict write-permissions where only the logging service can write to the store.\n\nImplement cryptographic hash chains to detect modification of log sequences.\n\nRegularly perform log integrity checks and monitor for anomalies.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 141,
                  "score": ""
                },
                {
                  "id": "9e0f426c-ad6b-4e70-a64f-c8b759d478e6",
                  "title": "Audit Log Database Repudiation: Inability to Prove or Attribute Actions",
                  "status": "Open",
                  "severity": "High",
                  "type": "Repudiation",
                  "description": "If logs are not immutable or lack sufficient metadata, users or administrators could deny performing certain actions such as configuration changes, failed login attempts, or data updates. This prevents accountability, hinders investigations, and weakens compliance requirements.",
                  "mitigation": "Use digitally signed, timestamped log entries that bind actions to authenticated identities.\n\nStore logs in immutable, append-only formats with restricted modification rights.\n\nMaintain a separate audit trail isolated from operational systems.\n\nImplement centralized logging with traceable event provenance.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 142,
                  "score": ""
                },
                {
                  "id": "d285d638-6c67-4398-bf54-c09716b52b24",
                  "title": "Audit Log Database Information Disclosure: Exposure of Sensitive Logging Information",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Information disclosure",
                  "description": "Audit logs may contain sensitive operational and user data such as IP addresses, user IDs, timestamps, authentication failures, or system-level actions. Unauthorized access to the log database can reveal system behavior patterns, help attackers escalate privileges, or expose private user activity.",
                  "mitigation": "Encrypt audit logs at rest using industry-standard encryption.\n\nEnforce strict read-access controls, limiting log access to authorized security and operational roles.\n\nImplement network segmentation so logs are not reachable by general application traffic.\n\nMonitor and alert on suspicious log access attempts.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 143,
                  "score": ""
                },
                {
                  "id": "16cbf9b5-b489-4842-80d8-32901f7523a9",
                  "title": "Audit Log Database Denial of Service: Disruption of Audit Log Availability or Logging Pipeline",
                  "status": "Open",
                  "severity": "Medium",
                  "type": "Denial of service",
                  "description": "An attacker could overload the logging pipeline by generating excessive events, sending malformed log entries, or exploiting inefficient log ingestion routines. This may delay or prevent critical events from being recorded, compromising visibility and investigative capabilities.",
                  "mitigation": "Apply rate limiting and throttling to the logging subsystem.\n\nUse scalable log ingestion pipelines with buffering and queueing mechanisms.\n\nMonitor log write performance, queue size, and ingestion failures.\n\nImplement log rotation, quotas, and storage capacity planning.",
                  "modelType": "STRIDE",
                  "new": false,
                  "number": 144,
                  "score": ""
                }
              ],
              "threatFrequency": {
                "tampering": 1,
                "repudiation": 1,
                "informationDisclosure": 1,
                "denialOfService": 1
              }
            }
          }
        ]
      }
    ],
    "diagramTop": 10,
    "threatTop": 238
  }
}